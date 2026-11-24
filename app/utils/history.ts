export interface HistoryRecord {
  id: string
  prompt: string
  /** 是否带参考图。参考图本体不落盘，避免 base64 撑爆 localStorage 配额 */
  hasReference: boolean
  image: string
  createdAt: string
}

const STORAGE_KEY = 'zaojian:history:v2'
export const MAX_RECORDS = 12

function isHistoryRecord(value: unknown): value is HistoryRecord {
  if (!value || typeof value !== 'object')
    return false
  const item = value as Record<string, unknown>
  return typeof item.id === 'string'
    && typeof item.prompt === 'string'
    && typeof item.image === 'string'
    && typeof item.hasReference === 'boolean'
    && typeof item.createdAt === 'string'
    && !Number.isNaN(Date.parse(item.createdAt))
}

export function loadHistory(): HistoryRecord[] {
  try {
    const items = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
    if (!Array.isArray(items))
      return []
    return items.filter(isHistoryRecord).slice(0, MAX_RECORDS)
  }
  catch {
    return []
  }
}

export function saveHistory(items: HistoryRecord[]): boolean {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items.slice(0, MAX_RECORDS)))
    return true
  }
  catch {
    return false
  }
}

export function clearHistory(): void {
  try {
    localStorage.removeItem(STORAGE_KEY)
  }
  catch {
    // 存储不可用时无需处理，调用方会重新读取到空列表
  }
}

export function formatTime(iso: string): string {
  return new Date(iso).toLocaleString('zh-CN', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })
}
