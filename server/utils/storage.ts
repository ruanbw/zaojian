import type { Store } from '@edgeone/pages-blob'
import { getStore } from '@edgeone/pages-blob'
import { Buffer } from 'node:buffer'

/**
 * 生成图存放在 EdgeOne Blob，而不是函数本地磁盘：
 * 云函数实例不持久、多实例间不共享，本地文件在部署后即丢失。
 */
const STORE_NAME = 'generated'
const STORE_PREFIX = 'images/'

/** 只保留最新 keep 张，历史记录里的旧图会失效（前端有降级占位） */
const DEFAULT_KEEP = 200

/**
 * 惰性初始化：getStore 在调用时就校验 Pages 环境凭证，
 * 放在模块顶层会让缺少凭证的环境（本地 node 预览、CI）连模块都加载不了。
 */
let storeInstance: Store | undefined

function store(): Store {
  storeInstance ??= getStore(STORE_NAME)
  return storeInstance
}

function keyOf(filename: string): string {
  return `${STORE_PREFIX}${filename}`
}

/**
 * 读取一张生成图，不存在时返回 null（由调用方转 404）。
 * 前端在生成响应后会立刻拉取该图；Blob 默认为最终一致（跨节点秒级延迟），
 * 因此这里必须用强一致读，绕过边缘缓存直读主存储。
 */
export async function readGeneratedImage(filename: string): Promise<Buffer | null> {
  const data = await store().get(keyOf(filename), { type: 'arrayBuffer', consistency: 'strong' })
  return data ? Buffer.from(data) : null
}

/**
 * 清理旧图：按 key 中的时间戳保留最新 keep 张。
 *
 * 文件名形如 <epoch-ms>-<uuid>.png，时间戳在前且位数固定（13 位），字典序即时间序，
 * 无需逐个取元数据。全部 best-effort：列出或删除失败都不影响主流程。
 */
export async function pruneGenerated(keep = DEFAULT_KEEP): Promise<void> {
  try {
    const { blobs } = await store().list({ prefix: STORE_PREFIX })
    if (blobs.length <= keep)
      return

    const expired = blobs
      .map(blob => blob.key)
      .sort((a, b) => b.localeCompare(a))
      .slice(keep)

    await Promise.all(expired.map(key => store().delete(key).catch(() => undefined)))
  }
  catch {
    // 存储不可用时跳过清理
  }
}

/**
 * 写入一张生成图；返回值即前端可访问的同源路径。
 * SDK 的 BlobInput 类型未包含 Node Buffer，转成底层 ArrayBuffer 传入（零拷贝）。
 */
export async function saveGeneratedImage(filename: string, data: Buffer): Promise<string> {
  // sharp 输出底层是 ArrayBuffer，实例收窄后零拷贝；其他来源（SharedArrayBuffer）拷贝一份
  const bytes = data.buffer instanceof ArrayBuffer
    ? data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength)
    : Uint8Array.from(data).buffer
  await store().set(keyOf(filename), bytes)
  return `/generated/${filename}`
}
