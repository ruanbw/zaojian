import { randomUUID } from 'node:crypto'
import fsSync from 'node:fs'
import fs from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'
import cors from 'cors'
import express from 'express'
import { DEFAULT_MODELS, generateImage } from './gateway.js'
import { addBrandWatermark } from './watermark.js'

const PORT = Number.parseInt(process.env.API_PORT || '3001', 10)
const PUBLIC_BASE = process.env.PUBLIC_BASE_URL || `http://localhost:${PORT}`
const OUTPUT_DIR = path.resolve('public/generated')

fsSync.mkdirSync(OUTPUT_DIR, { recursive: true })

const app = express()
app.use(cors())
app.use(express.json({ limit: '24mb' }))

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, models: DEFAULT_MODELS })
})

app.post('/api/generate', async (req, res) => {
  const { prompt, reference = '', model, size = '1024x1024' } = req.body || {}

  if (typeof prompt !== 'string' || !prompt.trim() || prompt.length > 120)
    return res.status(400).json({ error: '描述需为 1-120 个字符' })
  if (reference && !/^data:image\/(?:png|jpe?g|webp);base64,/i.test(reference))
    return res.status(400).json({ error: '参考图格式不支持' })

  const candidates = model ? [model] : DEFAULT_MODELS
  let generated
  let lastError

  for (const candidate of candidates) {
    try {
      generated = await generateImage({ prompt: prompt.trim(), reference, model: candidate, size })
      break
    }
    catch (error) {
      lastError = error
      console.warn(`生图模型 ${candidate} 失败：${error.message}`)
    }
  }

  if (!generated)
    throw lastError || new Error('没有可用的生图模型')

  const finalBuffer = await addBrandWatermark(generated.buffer)
  const filename = `${Date.now()}-${randomUUID()}.png`
  await fs.writeFile(path.join(OUTPUT_DIR, filename), finalBuffer)

  res.json({
    image: `${PUBLIC_BASE}/generated/${filename}`,
    path: `/generated/${filename}`,
    model: generated.model,
  })
})

app.use('/generated', express.static(OUTPUT_DIR, { maxAge: '1d' }))

app.use((error, _req, res, _next) => {
  console.error(error)
  res.status(error.status || 502).json({ error: error.message || '生成失败' })
})

app.listen(PORT, () => {
  console.log(`image-gen API running at http://localhost:${PORT}`)
})
