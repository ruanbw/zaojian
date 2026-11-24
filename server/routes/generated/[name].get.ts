import fs from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'

const OUTPUT_DIR = process.env.GENERATED_DIR
  ? path.resolve(process.env.GENERATED_DIR)
  : path.resolve(process.cwd(), 'server/generated')

export default defineEventHandler(async (event) => {
  const name = getRouterParam(event, 'name') ?? ''
  // 只允许纯文件名，防止路径穿越
  if (!/^[\w.-]+\.png$/.test(name))
    throw createError({ statusCode: 400, statusMessage: 'Bad Request', message: '非法的文件名' })

  const file = path.join(OUTPUT_DIR, name)
  try {
    const data = await fs.readFile(file)
    setHeader(event, 'content-type', 'image/png')
    setHeader(event, 'cache-control', 'public, max-age=86400')
    return data
  }
  catch {
    throw createError({ statusCode: 404, statusMessage: 'Not Found', message: '图片不存在' })
  }
})
