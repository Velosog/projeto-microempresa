import { describe, it, expect, beforeEach, vi } from 'vitest'
import { checkIpRateLimit, checkIpDailyLimit, checkSessionLimit, getSessionCount } from '../rateLimiter'

// Each test file gets its own module instance, but within a file
// we need unique IPs/sessions to avoid cross-test pollution.

let ipCounter = 0
let sessionCounter = 0
function uniqueIp() { return `test-ip-${++ipCounter}-${Date.now()}` }
function uniqueSession() { return `test-sess-${++sessionCounter}-${Date.now()}` }

describe('checkIpRateLimit (per-minute burst)', () => {
  it('allows the first request', () => {
    const result = checkIpRateLimit(uniqueIp())
    expect(result.allowed).toBe(true)
  })

  it('allows up to 30 requests within the window', () => {
    const ip = uniqueIp()
    for (let i = 0; i < 30; i++) {
      expect(checkIpRateLimit(ip).allowed).toBe(true)
    }
  })

  it('blocks after exceeding 30 requests', () => {
    const ip = uniqueIp()
    for (let i = 0; i < 30; i++) {
      checkIpRateLimit(ip)
    }
    const result = checkIpRateLimit(ip)
    expect(result.allowed).toBe(false)
    expect(result.reason).toContain('bloqueado')
  })
})

describe('checkIpDailyLimit (40/day)', () => {
  it('allows the first request and reports remaining', () => {
    const result = checkIpDailyLimit(uniqueIp())
    expect(result.allowed).toBe(true)
    expect(result.remaining).toBe(39)
  })

  it('allows up to 40 requests', () => {
    const ip = uniqueIp()
    for (let i = 0; i < 40; i++) {
      expect(checkIpDailyLimit(ip).allowed).toBe(true)
    }
  })

  it('blocks after exceeding 40 requests with friendly message', () => {
    const ip = uniqueIp()
    for (let i = 0; i < 40; i++) {
      checkIpDailyLimit(ip)
    }
    const result = checkIpDailyLimit(ip)
    expect(result.allowed).toBe(false)
    expect(result.remaining).toBe(0)
    expect(result.reason).toContain('limite diário')
    expect(result.reason).toContain('WhatsApp')
  })

  it('tracks remaining count correctly', () => {
    const ip = uniqueIp()
    checkIpDailyLimit(ip) // 1st → 39 remaining
    const second = checkIpDailyLimit(ip) // 2nd → 38 remaining
    expect(second.remaining).toBe(38)
  })
})

describe('checkSessionLimit', () => {
  it('allows up to 20 messages per session', () => {
    const sess = uniqueSession()
    for (let i = 0; i < 20; i++) {
      expect(checkSessionLimit(sess).allowed).toBe(true)
    }
  })

  it('blocks after 20 messages', () => {
    const sess = uniqueSession()
    for (let i = 0; i < 20; i++) {
      checkSessionLimit(sess)
    }
    const result = checkSessionLimit(sess)
    expect(result.allowed).toBe(false)
    expect(result.remaining).toBe(0)
    expect(result.reason).toContain('WhatsApp')
  })
})

describe('getSessionCount', () => {
  it('returns 0 for unknown sessions', () => {
    expect(getSessionCount('nonexistent-session')).toBe(0)
  })

  it('returns the correct count after messages', () => {
    const sess = uniqueSession()
    checkSessionLimit(sess)
    checkSessionLimit(sess)
    checkSessionLimit(sess)
    expect(getSessionCount(sess)).toBe(3)
  })
})
