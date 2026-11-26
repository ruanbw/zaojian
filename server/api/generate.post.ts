import type { Buffer } from 'node:buffer'
import { randomUUID } from 'node:crypto'
import type { GenerateResult } from '../utils/gateway'
import { DEFAULT_MODELS, generateImage, TOTAL_BUDGET_MS } from '../utils/gateway'
import { addBrandWatermark } from '../utils/watermark'
import { pruneGenerated, saveGeneratedImage } from '../utils/storage'

const REFERENCE_PATTERN = /^data:image\/(?:png|jpe?g|webp);base64,/i

/** 标准 reason phrase：statusMessage 会进入 HTTP 状态行，必须保持 ASCII */
const REASON_PHRASES: Record<number, string> = {
  400: 'Bad Request',
  404: 'Not Found',
  502: 'Bad Gateway',
  504: 'Gateway Timeout',
}

/**
 * h3 的 statusMessage 只允许 ASCII（进 HTTP 状态行），中文说明放 message，
 * 前端从响应的 message 字段取提示文案。
 */
function fail(statusCode: number, message: string): never {
  throw createError({ statusCode, statusMessage: REASON_PHRASES[statusCode], message })
}

/** 判断错误是否属于超时：AbortSignal 超时抛 TimeoutError / AbortError，也兼容文案里的「超时」 */
function isTimeoutError(error: unknown): boolean {
  if (!error || typeof error !== 'object')
    return false

  if ('name' in error && typeof error.name === 'string'
    && (error.name === 'TimeoutError' || error.name === 'AbortError')) {
    return true
  }

  const message = error instanceof Error ? error.message : ''
  return message.includes('超时')
}

export default defineEventHandler(async (event) => {
  // 没有配置生图后端时不进入候选循环：空列表会跳过所有模型并落到通用的 502 文案
  if (DEFAULT_MODELS.length === 0) {
    console.warn('生图后端未配置：请设置 MAGPIE_IMAGE_MCP 与 IMAGE_MODELS')
    fail(502, '生图服务尚未配置。')
  }

  // 整个请求共享同一个时间预算：多模型 fallback 也在这段时间内，不再每个模型各自计时
  const deadline = Date.now() + TOTAL_BUDGET_MS

  const body = await readBody<{ prompt?: unknown, reference?: unknown, model?: unknown, size?: unknown }>(event)

  const prompt = typeof body?.prompt === 'string' ? body.prompt : ''
  const reference = typeof body?.reference === 'string' ? body.reference : ''
  const model = typeof body?.model === 'string' ? body.model : undefined
  const size = typeof body?.size === 'string' ? body.size : '1024x1024'

  if (!prompt.trim() || prompt.length > 120)
    fail(400, '描述需为 1-120 个字符')
  if (reference && !REFERENCE_PATTERN.test(reference))
    fail(400, '参考图格式不支持')

  const candidates = model ? [model] : DEFAULT_MODELS
  let generated: GenerateResult | undefined
  let lastError: unknown
  let timedOut = false

  for (const candidate of candidates) {
    // 预算已耗尽：不再尝试后续模型，直接按超时处理
    if (Date.now() >= deadline) {
      timedOut = true
      lastError = new Error('生成超时，请重试。')
      console.warn('生成预算已耗尽，停止尝试后续模型')
      break
    }

    try {
      generated = await generateImage({ prompt: prompt.trim(), reference, model: candidate, size, deadline })
      break
    }
    catch (error) {
      lastError = error
      console.warn(`生图模型 ${candidate} 失败：${error instanceof Error ? error.message : String(error)}`)
      if (isTimeoutError(error)) {
        timedOut = true
        break
      }
    }
  }

  if (!generated) {
    // 用户可见文案不暴露模型名与网关原始报错，细节只留在服务端日志
    console.warn(`生成失败：${lastError instanceof Error ? lastError.message : '没有可用的生图模型'}`)
    if (timedOut)
      fail(504, '生成超时，请重试。')
    fail(502, '生成服务暂时不可用，请稍后重试。')
  }

  const finalBuffer: Buffer = await addBrandWatermark(generated.buffer)
  const filename = `${Date.now()}-${randomUUID()}.png`
  const imageUrl = await saveGeneratedImage(filename, finalBuffer)

  // 产物保留策略：只保留最新 200 张，历史记录里的旧图会失效（前端有降级占位）
  await pruneGenerated()

  return {
    image: imageUrl,
    path: imageUrl,
    model: generated.model,
  }
})
