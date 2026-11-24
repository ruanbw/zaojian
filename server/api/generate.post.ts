import type { Buffer } from 'node:buffer'
import fs from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'
import { randomUUID } from 'node:crypto'
import type { GenerateResult } from '../utils/gateway'
import { DEFAULT_MODELS, generateImage } from '../utils/gateway'
import { addBrandWatermark } from '../utils/watermark'

// 生成图存放目录：放在 public/ 之外，避免构建时被复制进产物而与运行期新增不同步
const OUTPUT_DIR = process.env.GENERATED_DIR
  ? path.resolve(process.env.GENERATED_DIR)
  : path.resolve(process.cwd(), 'server/generated')

const REFERENCE_PATTERN = /^data:image\/(?:png|jpe?g|webp);base64,/i

/** 标准 reason phrase：statusMessage 会进入 HTTP 状态行，必须保持 ASCII */
const REASON_PHRASES: Record<number, string> = {
  400: 'Bad Request',
  404: 'Not Found',
  502: 'Bad Gateway',
}

/**
 * h3 的 statusMessage 只允许 ASCII（进 HTTP 状态行），中文说明放 message，
 * 前端从响应的 message 字段取提示文案。
 */
function fail(statusCode: number, message: string): never {
  throw createError({ statusCode, statusMessage: REASON_PHRASES[statusCode], message })
}

export default defineEventHandler(async (event) => {
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

  for (const candidate of candidates) {
    try {
      generated = await generateImage({ prompt: prompt.trim(), reference, model: candidate, size })
      break
    }
    catch (error) {
      lastError = error
      console.warn(`生图模型 ${candidate} 失败：${error instanceof Error ? error.message : String(error)}`)
    }
  }

  if (!generated) {
    const message = lastError instanceof Error ? lastError.message : '没有可用的生图模型'
    fail(502, message)
  }

  const finalBuffer: Buffer = await addBrandWatermark(generated.buffer)
  await fs.mkdir(OUTPUT_DIR, { recursive: true })
  const filename = `${Date.now()}-${randomUUID()}.png`
  await fs.writeFile(path.join(OUTPUT_DIR, filename), finalBuffer)

  return {
    image: `/generated/${filename}`,
    path: `/generated/${filename}`,
    model: generated.model,
  }
})
