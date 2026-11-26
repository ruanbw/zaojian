import type { Store } from '@edgeone/pages-blob'
import type { H3Event } from 'h3'
import { getStore } from '@edgeone/pages-blob'

/**
 * 应用层日配额（L1 防刷）。
 *
 * 三层计数，全部存 EdgeOne Blob（免费档可用，单次 get 支持 consistency:'strong'）：
 *   设备（签名 Cookie）3 张/天 —— 单用户为主
 *   客户端 IP 10 张/天       —— NAT 共享 IP 的兜底上限
 *   全站 200 张/天           —— 成本熔断（200 × ¥0.025 = ¥5/天硬上限）
 *
 * 设计取舍（详见调研结论）：
 * - Blob 无 CAS/条件写，读改写存在竞争窗口；并发下可能多放几张图，
 *   代价可控（每张 ¥0.025），换来的是不引入外部依赖。
 * - 先占位后生图：配额扣了才调 MiniMax，失败不回滚（避免退款逻辑被刷）。
 * - 任何存储错误都按「放行」处理并记日志：Blob 抖动不该打死正常用户；
 *   L0 边缘规则 + MiniMax 预充值仍然兜底。
 * - 本地开发（无 Blob 凭证）降级为单实例内存计数，功能可验证。
 */

const STORE_NAME = 'quota'

/** 配额键前缀；日界用 UTC 日期，天然过期——新一天键就变了，旧键成为垃圾 */
const PREFIX = 'gen/'

export const DEVICE_DAILY_LIMIT = 3
export const IP_DAILY_LIMIT = 10
export const SITE_DAILY_LIMIT = 200

export type QuotaScope = 'device' | 'ip' | 'site'

export interface QuotaCheck {
  /** 是否允许本次生成 */
  allowed: boolean
  /** 不允许时命中哪一层（用于文案与日志） */
  scope?: QuotaScope
  /** 该层当日已用张数（allowed 时为占位后的值） */
  used?: number
  /** 该层日上限 */
  limit?: number
}

/** 用户可见文案：message 进响应体，前端直接展示 */
const LIMIT_MESSAGES = {
  device: '今日生成次数已用完，明天再来试试。',
  ip: '当前网络今日生成次数已达上限，请更换网络或明天再试。',
  site: '今日生成服务已达总量上限，请明天再使用。',
} satisfies Record<QuotaScope, string>

export function quotaMessage(scope: QuotaScope): string {
  return LIMIT_MESSAGES[scope]
}

/** UTC 日期（如 2026-11-27）。用 UTC 而非本地时区：全球节点行为一致，避免时区切换刷配额 */
function today(): string {
  return new Date().toISOString().slice(0, 10)
}

// ─── 存储抽象：线上 Blob / 本地内存 ───

interface CounterStore {
  read(key: string): Promise<number | null>
  write(key: string, value: number): Promise<void>
}

/** 本地开发的内存实现：云函数实例不共享内存，线上不可用，仅缺凭证时兜底 */
class MemoryStore implements CounterStore {
  private readonly map = new Map<string, number>()
  async read(key: string) {
    return this.map.get(key) ?? null
  }
  async write(key: string, value: number) {
    this.map.set(key, value)
  }
}

let storeInstance: CounterStore | undefined

function store(): CounterStore {
  if (storeInstance !== undefined)
    return storeInstance
  try {
    // getStore 在无 Pages 凭证的环境会抛错（本地 node）——惰性初始化 + try/catch 降级
    const blobStore: Store = getStore(STORE_NAME)
    storeInstance = {
      async read(key) {
        const raw = await blobStore.get(`${PREFIX}${key}`, { type: 'json', consistency: 'strong' })
        return typeof raw === 'number' ? raw : null
      },
      async write(key, value) {
        await blobStore.setJSON(`${PREFIX}${key}`, value)
      },
    }
  }
  catch {
    console.warn('Blob 不可用（本地开发？），配额使用进程内存计数')
    storeInstance = new MemoryStore()
  }
  return storeInstance
}

/** 竞争窗口内的已知计数（Blob 抖动重试时避免重复 +1） */
const attempted = new Map<string, number>()

function keyOf(scope: QuotaScope, identity: string): string {
  return `${today()}/${scope}/${identity}`
}

interface Layer {
  scope: QuotaScope
  identity: string
  limit: number
}

/**
 * 检查并占位：读三层计数，全部未超限则全部 +1 写回。
 * 任一层超限返回 { allowed:false }；未占位的层不写。
 * 存储异常时返回 { allowed:true }（放行，靠 L0/预充值兜底）。
 */
export async function reserveQuota(deviceId: string, clientIp: string): Promise<QuotaCheck> {
  const layers: Layer[] = [
    { scope: 'device', identity: deviceId, limit: DEVICE_DAILY_LIMIT },
    { scope: 'ip', identity: clientIp, limit: IP_DAILY_LIMIT },
    { scope: 'site', identity: 'global', limit: SITE_DAILY_LIMIT },
  ]

  const counts = new Map<string, number>()
  try {
    // 先读后写：三层在同一 try 内，读失败直接整体放行
    for (const layer of layers) {
      const key = keyOf(layer.scope, layer.identity)
      // 抖动重试时沿用本实例已尝试的计数，避免重复计数
      const current = attempted.has(key) ? (attempted.get(key) as number) : await store().read(key)
      if (current === null || !Number.isFinite(current)) {
        // 无计数或脏数据按 0 处理
        counts.set(key, 0)
      }
      else {
        counts.set(key, current)
      }
    }
  }
  catch (error) {
    console.warn(`配额读取失败，放行本次请求：${error instanceof Error ? error.message : String(error)}`)
    return { allowed: true }
  }

  // 任一层超限：拒绝（不写任何计数）
  for (const layer of layers) {
    const key = keyOf(layer.scope, layer.identity)
    const used = counts.get(key) ?? 0
    if (used >= layer.limit) {
      console.warn(`配额拒绝（${layer.scope}）：${used}/${layer.limit}`)
      return { allowed: false, scope: layer.scope, used, limit: layer.limit }
    }
  }

  // 全部通过：占位（+1 并写回；写失败也放行——宁可多生成不可误伤）
  try {
    for (const [key, used] of counts) {
      const next = used + 1
      attempted.set(key, next)
      await store().write(key, next)
    }
  }
  catch (error) {
    console.warn(`配额占位写入失败（放行）：${error instanceof Error ? error.message : String(error)}`)
  }

  return { allowed: true }
}

/** 拿到客户端 IP：XFF 必须取最后一个（EdgeOne 在末尾追加真实客户端 IP，首条可伪造） */
export function clientIpOf(event: H3Event): string {
  const forwarded = getRequestHeader(event, 'x-forwarded-for')
  if (typeof forwarded === 'string' && forwarded.trim()) {
    const parts = forwarded.split(',').map(s => s.trim()).filter(Boolean)
    const last = parts.at(-1)
    if (last)
      return last
  }
  return getRequestIP(event, { xForwardedFor: false }) || 'unknown'
}
