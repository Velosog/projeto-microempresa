/**
 * In-memory rate limiter for the /api/chat endpoint.
 * Tracks requests per IP and per session.
 *
 * Designed for single-instance Vercel Edge/Node functions.
 * For multi-instance deployments, replace with Redis or Upstash.
 *
 * Future: swap ipStore / sessionStore for Supabase tables.
 */

// IP-level: max requests per window
const IP_MAX_REQUESTS = 30
const IP_WINDOW_MS = 60 * 1000 // 1 minute

// Session-level: max total messages
const SESSION_MAX_MESSAGES = 20

// Temporary block duration for abusers
const BLOCK_DURATION_MS = 5 * 60 * 1000 // 5 minutes

/** @type {Map<string, { count: number, windowStart: number, blocked: boolean, blockedAt: number }>} */
const ipStore = new Map()

/** @type {Map<string, { count: number }>} */
const sessionStore = new Map()

/**
 * Checks whether the given IP is allowed to make a request.
 *
 * @param {string} ip
 * @returns {{ allowed: boolean, reason?: string }}
 */
export function checkIpRateLimit(ip) {
  const now = Date.now()
  const entry = ipStore.get(ip)

  if (!entry) {
    ipStore.set(ip, { count: 1, windowStart: now, blocked: false, blockedAt: 0 })
    return { allowed: true }
  }

  // Check if IP is temporarily blocked
  if (entry.blocked) {
    const elapsed = now - entry.blockedAt
    if (elapsed < BLOCK_DURATION_MS) {
      const remaining = Math.ceil((BLOCK_DURATION_MS - elapsed) / 1000)
      return {
        allowed: false,
        reason: `Muitas requisições. Aguarde ${remaining} segundos antes de tentar novamente.`,
      }
    }
    // Block expired – reset
    entry.blocked = false
    entry.count = 0
    entry.windowStart = now
  }

  // Slide the window
  if (now - entry.windowStart > IP_WINDOW_MS) {
    entry.count = 1
    entry.windowStart = now
    return { allowed: true }
  }

  entry.count += 1

  if (entry.count > IP_MAX_REQUESTS) {
    entry.blocked = true
    entry.blockedAt = now
    return {
      allowed: false,
      reason: 'Limite de requisições excedido. Você foi temporariamente bloqueado.',
    }
  }

  return { allowed: true }
}

/**
 * Checks whether the given session has remaining message quota.
 *
 * @param {string} sessionId
 * @returns {{ allowed: boolean, remaining: number, reason?: string }}
 */
export function checkSessionLimit(sessionId) {
  const entry = sessionStore.get(sessionId)

  if (!entry) {
    sessionStore.set(sessionId, { count: 1 })
    return { allowed: true, remaining: SESSION_MAX_MESSAGES - 1 }
  }

  entry.count += 1

  if (entry.count > SESSION_MAX_MESSAGES) {
    return {
      allowed: false,
      remaining: 0,
      reason:
        'Você atingiu o limite de mensagens desta sessão. Por favor, entre em contato pelo WhatsApp para continuar.',
    }
  }

  return { allowed: true, remaining: SESSION_MAX_MESSAGES - entry.count }
}

/**
 * Returns the current message count for a session.
 *
 * @param {string} sessionId
 * @returns {number}
 */
export function getSessionCount(sessionId) {
  return sessionStore.get(sessionId)?.count ?? 0
}

// Periodic cleanup to prevent memory leaks (runs every 10 minutes)
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now()

    for (const [ip, entry] of ipStore.entries()) {
      const expired = now - entry.windowStart > IP_WINDOW_MS
      const unblocked = !entry.blocked || now - entry.blockedAt > BLOCK_DURATION_MS
      if (expired && unblocked) {
        ipStore.delete(ip)
      }
    }
  }, 10 * 60 * 1000)
}
