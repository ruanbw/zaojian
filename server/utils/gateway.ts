import { Buffer } from 'node:buffer'
import process from 'node:process'
import { setTimeout as sleep } from 'node:timers/promises'

/**
 * 生图网关地址：EdgeOne 上没有本机服务，必须由环境变量提供。
 * 未配置时故意留空，请求会立即失败并返回 502，而不是把 localhost 编进产物。
 */
const GATEWAY_URL = process.env.MAGPIE_IMAGE_MCP || ''
const REQUEST_TIMEOUT = 180_000

/**
 * 一次生成请求的总时间预算：所有候选模型共享，超时统一按 504 处理。
 * EdgeOne Cloud Functions 单次执行上限 120 秒（maxDuration），
 * 预算必须为水印、写 Blob、响应留出余量。
 */
export const TOTAL_BUDGET_MS = 100_000

/** 单次图片下载上限 */
const DOWNLOAD_TIMEOUT = 60_000

/** 轮询生成结果的最大次数与轮询间隔 */
const MAX_POLL_ATTEMPTS = 30
const POLL_INTERVAL_MS = 2000

/** 超时文案：服务端与前端保持一致 */
const TIMEOUT_MESSAGE = '生成超时，请重试。'

/**
 * 候选模型，按顺序尝试。由环境变量 IMAGE_MODELS 配置，逗号分隔；
 * 未配置时为空，/api/generate 会直接返回 502。
 */
function loadModels(): string[] {
  const raw = process.env.IMAGE_MODELS || ''
  return raw.split(',').map(item => item.trim()).filter(Boolean)
}

export const DEFAULT_MODELS: readonly string[] = loadModels()

/** 网关返回的内容块 */
interface ContentBlock {
  type?: string
  text?: string
  data?: string
  mimeType?: string
}

interface ToolResult {
  content?: ContentBlock[]
  _meta?: Record<string, { url?: string }[]>
  isError?: boolean
}

interface JsonRpcResponse {
  result?: ToolResult
  error?: { message?: string }
}

export interface GeneratedImage {
  buffer?: Buffer
  url?: string
  mimeType?: string
}

export interface GenerateResult {
  buffer: Buffer
  mimeType: string
  model: string
}

/**
 * 计算本次调用可用的超时时长：单次上限与全局 deadline 取较小值。
 * deadline 已耗尽时直接抛超时错误（AbortSignal.timeout(0) 会立即 abort，不适用）。
 */
function resolveTimeout(deadline: number | undefined, cap: number): number {
  if (deadline === undefined)
    return cap

  const remaining = deadline - Date.now()
  if (remaining <= 0)
    throw new Error(TIMEOUT_MESSAGE)

  return Math.min(cap, Math.max(1, Math.floor(remaining)))
}

async function rpc(method: string, params: Record<string, unknown>, deadline?: number): Promise<ToolResult> {
  const timeout = resolveTimeout(deadline, REQUEST_TIMEOUT)
  const response = await fetch(GATEWAY_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json, text/event-stream',
    },
    body: JSON.stringify({ jsonrpc: '2.0', id: Date.now(), method, params }),
    signal: AbortSignal.timeout(timeout),
  })
  if (!response.ok)
    throw new Error(`网关返回 HTTP ${response.status}`)

  const payload = await response.json() as JsonRpcResponse
  if (payload.error)
    throw new Error(payload.error.message || '网关 JSON-RPC 错误')

  return payload.result ?? {}
}

function textOf(result: ToolResult): string {
  return (result.content || [])
    .filter(item => item?.type === 'text')
    .map(item => item.text ?? '')
    .join('\n')
}

function imageOf(result: ToolResult): GeneratedImage | null {
  const inline = (result.content || []).find(item => item?.type === 'image' && item.data)
  if (inline)
    return { buffer: Buffer.from(inline.data!, 'base64'), mimeType: inline.mimeType || 'image/png' }

  const url = result._meta?.['usemagpie.ai/files']?.[0]?.url
  return url ? { url } : null
}

async function download(url: string, deadline?: number): Promise<Buffer> {
  const timeout = resolveTimeout(deadline, DOWNLOAD_TIMEOUT)
  const response = await fetch(url, { signal: AbortSignal.timeout(timeout) })
  if (!response.ok)
    throw new Error(`下载生成图片失败：HTTP ${response.status}`)

  return Buffer.from(await response.arrayBuffer())
}

async function waitForResult(id: string, deadline?: number): Promise<GeneratedImage> {
  // 轮询次数上限受剩余时间约束：剩余秒数 / 轮询间隔，最多 30 次
  const maxAttempts = deadline === undefined
    ? MAX_POLL_ATTEMPTS
    : Math.min(MAX_POLL_ATTEMPTS, Math.floor((deadline - Date.now()) / 1000 / (POLL_INTERVAL_MS / 1000)))

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    // 等待时间不超过剩余预算，避免单次轮询把 deadline 拖过
    const wait = deadline === undefined
      ? POLL_INTERVAL_MS
      : Math.min(POLL_INTERVAL_MS, Math.max(0, deadline - Date.now()))
    await sleep(wait)
    if (deadline !== undefined && Date.now() >= deadline)
      throw new Error(TIMEOUT_MESSAGE)

    const result = await rpc('tools/call', { name: 'generation_result', arguments: { id } }, deadline)
    if (result.isError)
      throw new Error(textOf(result) || '生成任务失败')

    const image = imageOf(result)
    if (image)
      return image
  }
  throw new Error(TIMEOUT_MESSAGE)
}

export interface GenerateOptions {
  prompt: string
  reference?: string
  model?: string
  size?: string
  /** 绝对截止时间（epoch 毫秒）：超过后所有网络调用立即中止 */
  deadline?: number
}

export async function generateImage({ prompt, reference = '', model, size = '1024x1024', deadline }: GenerateOptions): Promise<GenerateResult> {
  const args: Record<string, unknown> = { prompt, n: 1, size }
  if (model)
    args.model = model
  if (reference)
    args.reference_images = [reference]

  const result = await rpc('tools/call', { name: 'generate_image', arguments: args }, deadline)
  if (result.isError)
    throw new Error(textOf(result) || '生图模型返回错误')

  let image = imageOf(result)
  if (!image) {
    const id = textOf(result).match(/"?id"?\s*[:：]\s*([\w-]+)/i)?.[1]
    if (id)
      image = await waitForResult(id, deadline)
  }
  if (!image)
    throw new Error('生成结果中没有图片')

  const buffer = image.buffer ?? await download(image.url!, deadline)
  return { buffer, mimeType: image.mimeType || 'image/png', model: model || 'unknown' }
}
