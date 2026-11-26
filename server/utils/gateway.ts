import { Buffer } from 'node:buffer'
import process from 'node:process'

/**
 * MiniMax image-01 直连适配器。
 *
 * 为什么不走之前的 MCP 网关：网关是本机 Magpie 服务，EdgeOne 云函数访问不到；
 * MiniMax 官方 API 同步返回，省掉「提交 → 轮询 → 下载 URL」三跳。
 *
 * 计费提醒：这是非幂等的付费请求，任何失败都不得自动重试，由用户显式重新提交。
 */

/** 中国站端点；账号在 platform.minimaxi.com，国际站是 api.minimax.io */
const ENDPOINT = process.env.MINIMAX_IMAGE_ENDPOINT || 'https://api.minimaxi.com/v1/image_generation'
const API_KEY = process.env.MINIMAX_API_KEY || ''
export const IMAGE_MODEL = 'image-01'

/**
 * 一次生成请求的总时间预算：超时统一按 504 处理。
 * EdgeOne Cloud Functions 单次执行上限 120 秒（maxDuration），
 * 预算必须为水印、写 Blob、响应留出余量。
 */
export const TOTAL_BUDGET_MS = 100_000

/** image-01 同步生成通常十几秒，单次请求上限与总预算取小 */
const REQUEST_TIMEOUT = 90_000

const TIMEOUT_MESSAGE = '生成超时，请重试。'

/** 后端是否已配置：缺 key 时 /api/generate 直接 502，不发请求 */
export const isConfigured = API_KEY !== ''

export interface GenerateResult {
  buffer: Buffer
  mimeType: string
  model: string
}

export interface GenerateOptions {
  prompt: string
  /** data:image/*;base64,... 形式；MiniMax 的 subject_reference 直接接受 Data URL */
  reference?: string
  /** 绝对截止时间（epoch 毫秒）：超过后网络调用立即中止 */
  deadline?: number
}

/** 用户可见的错误：message 会原样进入前端提示 */
export class GenerateError extends Error {
  constructor(message: string, readonly kind: 'timeout' | 'upstream' | 'content' | 'auth' | 'balance') {
    super(message)
    this.name = 'GenerateError'
  }
}

/**
 * base_resp.status_code 在 HTTP 200 里承载业务错误，必须逐个映射。
 * 1026 敏感内容 / 1008 余额不足 / 1004+2049 鉴权失败各有独立文案，
 * 其余统一「服务暂时不可用」；原始 status_msg 只进服务端日志。
 */
function toGenerateError(statusCode: number, statusMsg: string): GenerateError {
  console.warn(`MiniMax image-01 返回 base_resp ${statusCode}：${statusMsg}`)
  switch (statusCode) {
    case 1008:
      return new GenerateError('生图服务余额不足，请联系管理员充值。', 'balance')
    case 1026:
      return new GenerateError('描述或参考图未通过内容安全审核，请调整后重试。', 'content')
    case 1004:
    case 2049:
      return new GenerateError('生图服务鉴权失败，请检查 MINIMAX_API_KEY。', 'auth')
    case 1002:
      return new GenerateError('生图服务繁忙，请稍后重试。', 'upstream')
    case 2013:
      return new GenerateError('生图请求参数无效。', 'upstream')
    default:
      return new GenerateError('生图服务暂时不可用，请稍后重试。', 'upstream')
  }
}

function resolveTimeout(deadline: number | undefined): number {
  if (deadline === undefined)
    return REQUEST_TIMEOUT

  const remaining = deadline - Date.now()
  if (remaining <= 0)
    throw new GenerateError(TIMEOUT_MESSAGE, 'timeout')

  return Math.min(REQUEST_TIMEOUT, Math.max(1, Math.floor(remaining)))
}

interface MiniMaxResponse {
  id?: string
  data?: {
    image_base64?: string[]
    image_urls?: string[]
  }
  metadata?: { success_count?: number, failed_count?: number }
  base_resp?: { status_code?: number, status_msg?: string }
}

export async function generateImage({ prompt, reference = '', deadline }: GenerateOptions): Promise<GenerateResult> {
  if (!API_KEY)
    throw new GenerateError('生图服务尚未配置。', 'auth')

  const body: Record<string, unknown> = {
    model: IMAGE_MODEL,
    prompt,
    n: 1,
    aspect_ratio: '1:1',
    // base64 一步拿到字节：URL 形态 24 小时过期且还要再下载一次
    response_format: 'base64',
  }
  // image-01 唯一的图生图入口是 subject_reference，且只支持 character 类型
  if (reference) {
    body.subject_reference = [{ type: 'character', image_file: reference }]
  }

  let response: Response
  try {
    response = await fetch(ENDPOINT, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(resolveTimeout(deadline)),
    })
  }
  catch (error) {
    const name = error instanceof Error ? error.name : ''
    if (name === 'TimeoutError' || name === 'AbortError')
      throw new GenerateError(TIMEOUT_MESSAGE, 'timeout')
    console.warn(`MiniMax image-01 网络错误：${error instanceof Error ? error.message : String(error)}`)
    throw new GenerateError('生图服务暂时不可用，请稍后重试。', 'upstream')
  }

  if (!response.ok) {
    console.warn(`MiniMax image-01 返回 HTTP ${response.status}`)
    throw new GenerateError(
      response.status === 401 ? '生图服务鉴权失败，请检查 MINIMAX_API_KEY。' : '生图服务暂时不可用，请稍后重试。',
      response.status === 401 ? 'auth' : 'upstream',
    )
  }

  const payload = await response.json().catch(() => null) as MiniMaxResponse | null
  if (!payload?.base_resp)
    throw new GenerateError('生图服务返回了无法解析的响应。', 'upstream')

  if (payload.base_resp.status_code !== 0)
    throw toGenerateError(payload.base_resp.status_code ?? -1, payload.base_resp.status_msg ?? '')

  const encoded = payload.data?.image_base64?.[0]
  if (!encoded) {
    // status_code 0 但没图：全部被内容安全拦截（failed_count > 0）
    throw new GenerateError('生成结果为空，描述可能未通过内容安全审核。', 'content')
  }

  return {
    buffer: Buffer.from(encoded, 'base64'),
    mimeType: 'image/jpeg',
    model: IMAGE_MODEL,
  }
}
