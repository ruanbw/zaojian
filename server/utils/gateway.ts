import { Buffer } from 'node:buffer'
import process from 'node:process'

const GATEWAY_URL = process.env.MAGPIE_IMAGE_MCP || 'http://127.0.0.1:3425/mcp/magpie/image'
const REQUEST_TIMEOUT = 180_000

export const DEFAULT_MODELS = [
  'workbuddy-ai/hy-image-3.5',
  'workbuddy/hunyuan-image-alpha',
  'minimax-code/MiniMax-Image',
] as const

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

async function rpc(method: string, params: Record<string, unknown>): Promise<ToolResult> {
  const response = await fetch(GATEWAY_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json, text/event-stream',
    },
    body: JSON.stringify({ jsonrpc: '2.0', id: Date.now(), method, params }),
    signal: AbortSignal.timeout(REQUEST_TIMEOUT),
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

async function download(url: string): Promise<Buffer> {
  const response = await fetch(url, { signal: AbortSignal.timeout(60_000) })
  if (!response.ok)
    throw new Error(`下载生成图片失败：HTTP ${response.status}`)

  return Buffer.from(await response.arrayBuffer())
}

async function waitForResult(id: string): Promise<GeneratedImage> {
  for (let attempt = 0; attempt < 30; attempt++) {
    await new Promise(resolve => setTimeout(resolve, 2000))
    const result = await rpc('tools/call', { name: 'generation_result', arguments: { id } })
    if (result.isError)
      throw new Error(textOf(result) || '生成任务失败')

    const image = imageOf(result)
    if (image)
      return image
  }
  throw new Error('生成超时，请重试')
}

export interface GenerateOptions {
  prompt: string
  reference?: string
  model?: string
  size?: string
}

export async function generateImage({ prompt, reference = '', model, size = '1024x1024' }: GenerateOptions): Promise<GenerateResult> {
  const args: Record<string, unknown> = { prompt, n: 1, size }
  if (model)
    args.model = model
  if (reference)
    args.reference_images = [reference]

  const result = await rpc('tools/call', { name: 'generate_image', arguments: args })
  if (result.isError)
    throw new Error(textOf(result) || '生图模型返回错误')

  let image = imageOf(result)
  if (!image) {
    const id = textOf(result).match(/"?id"?\s*[:：]\s*([\w-]+)/i)?.[1]
    if (id)
      image = await waitForResult(id)
  }
  if (!image)
    throw new Error('生图结果中没有图片')

  const buffer = image.buffer ?? await download(image.url!)
  return { buffer, mimeType: image.mimeType || 'image/png', model: model || DEFAULT_MODELS[0] }
}
