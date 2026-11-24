import fs from 'node:fs/promises'
import path from 'node:path'

/**
 * 清理生成目录：按 mtime 保留最新 keep 个 .png，其余删除。
 * 历史记录里存的是 /generated/xxx.png 路径，产物被清理后旧记录的图片会失效，
 * 前端已有降级占位（显示占位图而不是破图）。
 * 全部为 best-effort：目录不存在、读取失败、删除失败都静默忽略，不影响主流程。
 */
export async function pruneGenerated(dir: string, keep = 200): Promise<void> {
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true })
    const pngs = entries.filter(entry => entry.isFile() && entry.name.toLowerCase().endsWith('.png'))
    if (pngs.length <= keep)
      return

    // 逐个 stat 取 mtime；单个文件失败时跳过，不影响整体清理
    const stats = await Promise.all(pngs.map(async (entry) => {
      const file = path.join(dir, entry.name)
      try {
        const stat = await fs.stat(file)
        return { file, mtime: stat.mtimeMs }
      }
      catch {
        return null
      }
    }))

    const sorted = stats
      .filter((item): item is { file: string, mtime: number } => item !== null)
      .sort((a, b) => b.mtime - a.mtime)

    const expired = sorted.slice(keep)
    await Promise.all(expired.map(item => fs.unlink(item.file).catch(() => undefined)))
  }
  catch {
    // 目录不存在或不可读，直接跳过
  }
}
