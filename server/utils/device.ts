import process from 'node:process'
import type { H3Event } from 'h3'
import { createHmac, randomBytes, timingSafeEqual } from 'node:crypto'
import { getCookie, setCookie } from 'h3'

// H3Event 是 nitro 全局注入的运行时值（自动导入），类型从 h3 导入使用

/**
 * 签名 Cookie 设备标识。
 *
 * 防刷的「设备」维度需要一个跨请求稳定的标识。localStorage 只在生图页之后才有，
 * 挡不住脚本直打 /api/generate；HttpOnly Cookie 在第一个请求就能带上。
 * 设备 ID 本体无含义，伪造无收益，但 HMAC 签名保证它不能凭空造一个没被计数过的 ID。
 *
 * 密钥：QUOTA_SECRET（EdgeOne 环境变量）。本地开发未配置时降级为「固定假密钥」，
 * 签名仍然自洽，只是防伪造强度为零——本地也不需要。
 */

const COOKIE_NAME = 'zj_device'
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365 // 一年，自然过期后自动换新设备

const SECRET = process.env.QUOTA_SECRET || 'dev-insecure-secret'

export interface Device {
  id: string
  /** true = 本次请求新发放的 Cookie，需要 Set-Cookie 下发 */
  isNew: boolean
}

function sign(id: string): string {
  return createHmac('sha256', SECRET).update(id).digest('base64url')
}

function verify(id: string, signature: string): boolean {
  const expected = Buffer.from(sign(id))
  const provided = Buffer.from(signature)
  // 长度不同直接 false，避免 timingSafeEqual 抛异常
  if (expected.length !== provided.length)
    return false
  return timingSafeEqual(expected, provided)
}

/** 解析「<id>.<sig>」格式的 Cookie 值；格式或签名不对一律视为无设备 */
function parseDeviceCookie(raw: string | undefined): Device | null {
  if (!raw)
    return null
  const dot = raw.lastIndexOf('.')
  if (dot <= 0)
    return null
  const id = raw.slice(0, dot)
  const signature = raw.slice(dot + 1)
  if (!id || !signature)
    return null
  if (!verify(id, signature)) {
    console.warn('设备 Cookie 验签失败，按新设备处理')
    return null
  }
  return { id, isNew: false }
}

/**
 * 读取当前请求的设备标识；没有或无效时发放新设备并挂到响应上。
 * 放在 /api/generate 入口调用，保证每个进到付费逻辑的请求都有设备 ID 可计。
 */
export function ensureDevice(event: H3Event): Device {
  const parsed = parseDeviceCookie(getCookie(event, COOKIE_NAME))
  if (parsed)
    return parsed

  const device: Device = { id: randomBytes(16).toString('hex'), isNew: true }
  setCookie(event, COOKIE_NAME, `${device.id}.${sign(device.id)}`, {
    httpOnly: true,
    sameSite: 'lax',
    maxAge: COOKIE_MAX_AGE,
    path: '/',
    // EdgeOne 全站 HTTPS；本地 http://localhost 会被浏览器忽略该标记，不影响开发
    secure: true,
  })
  return device
}
