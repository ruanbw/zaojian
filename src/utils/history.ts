export interface HistoryRecord {
  id: string
  prompt: string
  reference: string
  image: string
  createdAt: string
}

const STORAGE_KEY = 'zaojian:history:v1'
const MAX_RECORDS = 12

export function loadHistory(): HistoryRecord[] {
  try {
    const items = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
    return Array.isArray(items) ? items : []
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
