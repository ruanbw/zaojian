import type { Store } from '@edgeone/pages-blob'
import { Buffer } from 'node:buffer'
import { getStore, PagesBlobError } from '@edgeone/pages-blob'
import fs from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'

/**
 * 生成图存放：线上走 EdgeOne Blob，本地开发回退到磁盘。
 *
 * 为什么不能用纯本地磁盘：云函数实例不持久、多实例间不共享，部署后文件即丢。
 * 为什么要有本地回退：`node .output/server/index.mjs`、`nuxt preview`、CI 都没有
 * Pages 凭证，getStore 会抛 MISSING_ENVIRONMENT；没有回退本地无法跑通一次完整生成。
 *
 * 只对 MISSING_ENVIRONMENT 回退——配额超限、限流等线上真实故障不回退：
 * 云函数磁盘不持久，静默写本地等于丢图，宁可 500 让用户知道。
 */
const STORE_NAME = 'generated'
const STORE_PREFIX = 'images/'

/** 只保留最新 keep 张，历史记录里的旧图会失效（前端有降级占位） */
const DEFAULT_KEEP = 200

const LOCAL_DIR = path.resolve(process.cwd(), 'server/generated')

let storeInstance: Store | undefined
let useLocalDisk = false

/** 惰性初始化：getStore 在调用时就校验 Pages 环境凭证，模块顶层调用会让无凭证环境连模块都加载不了 */
function store(): Store | null {
  if (useLocalDisk)
    return null

  if (storeInstance)
    return storeInstance

  try {
    storeInstance = getStore(STORE_NAME)
    return storeInstance
  }
  catch (error) {
    if (error instanceof PagesBlobError && error.code === 'MISSING_ENVIRONMENT') {
      console.info('未检测到 EdgeOne Blob 环境，生成图回退到本地磁盘（仅限本地开发）')
      useLocalDisk = true
      return null
    }
    throw error
  }
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
  const blob = store()
  if (!blob)
    return fs.readFile(path.join(LOCAL_DIR, filename)).catch(() => null)

  const data = await blob.get(keyOf(filename), { type: 'arrayBuffer', consistency: 'strong' })
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
    const blob = store()
    if (!blob) {
      const names = (await fs.readdir(LOCAL_DIR)).filter(name => name.endsWith('.png')).sort((a, b) => b.localeCompare(a))
      await Promise.all(names.slice(keep).map(name => fs.unlink(path.join(LOCAL_DIR, name)).catch(() => undefined)))
      return
    }

    const { blobs } = await blob.list({ prefix: STORE_PREFIX })
    if (blobs.length <= keep)
      return

    const expired = blobs
      .map(item => item.key)
      .sort((a, b) => b.localeCompare(a))
      .slice(keep)

    await Promise.all(expired.map(key => blob.delete(key).catch(() => undefined)))
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
  const blob = store()
  if (!blob) {
    await fs.mkdir(LOCAL_DIR, { recursive: true })
    await fs.writeFile(path.join(LOCAL_DIR, filename), data)
    return `/generated/${filename}`
  }

  // sharp 输出底层是 ArrayBuffer，实例收窄后零拷贝；其他来源（SharedArrayBuffer）拷贝一份
  const bytes = data.buffer instanceof ArrayBuffer
    ? data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength)
    : Uint8Array.from(data).buffer
  await blob.set(keyOf(filename), bytes)
  return `/generated/${filename}`
}
