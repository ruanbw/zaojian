import { readGeneratedImage } from '../../utils/storage'

export default defineEventHandler(async (event) => {
  const name = getRouterParam(event, 'name') ?? ''
  // 只允许纯文件名，防止路径穿越
  if (!/^[\w.-]+\.png$/.test(name))
    throw createError({ statusCode: 400, statusMessage: 'Bad Request', message: '非法的文件名' })

  // Blob 不可用与对象不存在对客户端无区别，统一 404；避免把内部错误栈暴露成 500
  const data = await readGeneratedImage(name).catch(() => null)
  if (!data)
    throw createError({ statusCode: 404, statusMessage: 'Not Found', message: '图片不存在' })

  setHeader(event, 'content-type', 'image/png')
  setHeader(event, 'cache-control', 'public, max-age=86400')
  return data
})
