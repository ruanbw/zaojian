import { Buffer } from 'node:buffer'
import sharp from 'sharp'

const LABEL = 'AI 生成 · 造间'

export async function addBrandWatermark(buffer) {
  const { width = 1024, height = 1024 } = await sharp(buffer).metadata()
  const fontSize = Math.max(18, Math.round(width * 0.032))
  const paddingX = Math.round(fontSize * 0.9)
  const paddingY = Math.round(fontSize * 0.45)
  const boxWidth = Math.round(fontSize * 7.4 + paddingX * 2)
  const boxHeight = Math.round(fontSize * 1.7 + paddingY * 2)
  const margin = Math.round(width * 0.035)
  const x = width - margin - boxWidth
  const y = height - margin - boxHeight

  const overlay = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
    <rect x="${x}" y="${y}" width="${boxWidth}" height="${boxHeight}" rx="${Math.round(boxHeight / 2)}" fill="rgba(46, 40, 35, 0.62)" />
    <text x="${x + paddingX}" y="${y + paddingY + fontSize}" font-family="PingFang SC, Songti SC, sans-serif" font-size="${fontSize}" fill="#FFF9F1" letter-spacing="1">${LABEL}</text>
  </svg>`

  return sharp(buffer)
    .composite([{ input: Buffer.from(overlay), left: 0, top: 0 }])
    .png()
    .toBuffer()
}
