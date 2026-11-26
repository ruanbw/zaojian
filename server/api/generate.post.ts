import type { Buffer } from 'node:buffer'
import { randomUUID } from 'node:crypto'
import type { GenerateResult } from '../utils/gateway'
import { GenerateError, generateImage, IMAGE_MODEL, isConfigured, TOTAL_BUDGET_MS } from '../utils/gateway'
import { addBrandWatermark } from '../utils/watermark'
import { pruneGenerated, saveGeneratedImage } from '../utils/storage'

const REFERENCE_PATTERN = /^data:image\/(?:png|jpe?g|webp);base64,/i

/** 标准 reason phrase：statusMessage 会进入 HTTP 状态行，必须保持 ASCII */
const REASON_PHRASES: Record<number, string> = {
  400: 'Bad Request',
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

/** 错误类别 → HTTP 状态：鉴权/余额/内容问题对客户端都是 502 或 400，不暴露上游细节 */
function statusOf(kind: GenerateError['kind']): number {
  switch (kind) {
    case 'timeout':
      return 504
    case 'content':
      return 400
    default:
      return 502
  }
}

export default defineEventHandler(async (event) => {
  // 没有配置 API key 时不发请求，直接 502
  if (!isConfigured) {
    console.warn('生图后端未配置：请设置 MINIMAX_API_KEY')
    fail(502, '生图服务尚未配置。')
  }

  const body = await readBody<{ prompt?: unknown, reference?: unknown }>(event)

  const prompt = typeof body?.prompt === 'string' ? body.prompt : ''
  const reference = typeof body?.reference === 'string' ? body.reference : ''

  if (!prompt.trim() || prompt.length > 120)
    fail(400, '描述需为 1-120 个字符')
  if (reference && !REFERENCE_PATTERN.test(reference))
    fail(400, '参考图格式不支持')

  // 整个请求共享一个时间预算
  const deadline = Date.now() + TOTAL_BUDGET_MS

  let generated: GenerateResult
  try {
    generated = await generateImage({ prompt: prompt.trim(), reference, deadline })
  }
  catch (error) {
    if (error instanceof GenerateError) {
      console.warn(`生成失败（${error.kind}）：${error.message}`)
      fail(statusOf(error.kind), error.message)
    }
    console.warn(`生成失败：${error instanceof Error ? error.message : String(error)}`)
    fail(502, '生图服务暂时不可用，请稍后重试。')
  }

  let imageUrl: string
  try {
    const finalBuffer: Buffer = await addBrandWatermark(generated.buffer)
    const filename = `${Date.now()}-${randomUUID()}.png`
    imageUrl = await saveGeneratedImage(filename, finalBuffer)
  }
  catch (error) {
    // 用户已付费生成，后处理失败要让他知道图没存上；细节只进日志
    console.warn(`生成后处理失败：${error instanceof Error ? error.message : String(error)}`)
    fail(502, '图片已生成但保存失败，请稍后重试。')
  }

  // 产物保留策略：只保留最新 200 张，历史记录里的旧图会失效（前端有降级占位）
  await pruneGenerated()

  return {
    image: imageUrl,
    path: imageUrl,
    model: IMAGE_MODEL,
  }
})
