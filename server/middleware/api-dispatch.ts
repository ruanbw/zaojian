/**
 * API 路由显式分发。
 *
 * 为什么不依赖 Nitro 的文件路由：EdgeOne ssr-node 运行时下，Nitro router 对 POST 请求
 * 匹配不到按方法注册的 handler（GET 正常，POST 一律落到 /** 的页面渲染器并 500）。
 * middleware 拿到的 method/path 是正确的，所以在这里按方法+路径显式分发。
 *
 * 匹配到的请求直接执行 handler 并返回；未匹配的放行给后续流程（页面渲染）。
 */
const routes: Record<string, Record<string, () => Promise<{ default: EventHandler }>>> = {
  '/api/generate': { POST: () => import('../api/generate.post') },
  '/api/health': { GET: () => import('../api/health.get') },
}

export default defineEventHandler(async (event) => {
  const byMethod = routes[event.path]
  if (!byMethod)
    return

  const loader = byMethod[event.method]
  if (!loader) {
    throw createError({ statusCode: 405, statusMessage: 'Method Not Allowed', message: '不支持的请求方法' })
  }

  const mod = await loader()
  return mod.default(event)
})
