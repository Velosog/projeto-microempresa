/**
 * /api/chat – Vercel Serverless Function (Node.js runtime)
 *
 * Handles the dental clinic chatbot requests.
 *
 * Flow:
 *  1. Validate & sanitize input
 *  2. Check IP rate limit
 *  3. Check session message limit
 *  4. Load clinic.json and faq.json
 *  5. Try to match FAQ first (no AI cost)
 *  6. Fallback: call OpenAI with structured system prompt
 *  7. Return response with remaining message count
 *
 * Future (Supabase):
 *  - Replace in-memory rate limiter with DB counters
 *  - Persist conversation logs in conversations table
 *  - Track per-client usage via tenant_id
 */

import clinicData from '../src/data/clinic.json' assert { type: 'json' }
import faqData from '../src/data/faq.json' assert { type: 'json' }

import { buildSystemPrompt, findMatchingFaq, sanitizeInput } from '../src/utils/buildPrompt.js'
import { checkIpRateLimit, checkIpDailyLimit, checkSessionLimit } from '../src/utils/rateLimiter.js'

const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions'
const MODEL = 'gpt-4o-mini'
const MAX_TOKENS = 300
const MAX_HISTORY_MESSAGES = 10 // 5 pairs

/**
 * Main handler for POST /api/chat
 *
 * @param {import('@vercel/node').VercelRequest}  req
 * @param {import('@vercel/node').VercelResponse} res
 */
export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido.' })
  }

  // ── 1. Extract and validate input ──────────────────────────────
  const { message, history = [], sessionId } = req.body ?? {}

  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'Mensagem inválida.' })
  }

  if (!sessionId || typeof sessionId !== 'string') {
    return res.status(400).json({ error: 'Session ID ausente.' })
  }

  const cleanMessage = sanitizeInput(message)

  if (!cleanMessage) {
    return res.status(400).json({ error: 'Mensagem vazia após sanitização.' })
  }

  // ── 2. IP rate limit ────────────────────────────────────────────
  const ip =
    req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
    req.socket?.remoteAddress ||
    'unknown'

  const ipCheck = checkIpRateLimit(ip)
  if (!ipCheck.allowed) {
    console.log(`[RATE_LIMIT] IP blocked: ${ip}`)
    return res.status(429).json({ error: ipCheck.reason })
  }

  // ── 2b. IP daily quota ──────────────────────────────────────────
  const dailyCheck = checkIpDailyLimit(ip)
  if (!dailyCheck.allowed) {
    console.log(`[DAILY_LIMIT] IP daily quota exceeded: ${ip}`)
    return res.status(429).json({ error: dailyCheck.reason })
  }

  // ── 3. Session message limit ────────────────────────────────────
  const sessionCheck = checkSessionLimit(sessionId)
  if (!sessionCheck.allowed) {
    console.log(`[SESSION_LIMIT] Session blocked: ${sessionId}`)
    return res.status(429).json({ error: sessionCheck.reason })
  }

  console.log(
    `[CHAT] ip=${ip} session=${sessionId} remaining=${sessionCheck.remaining} msg="${cleanMessage.slice(0, 80)}"`
  )

  // ── 4. Try FAQ match first (no AI cost) ────────────────────────
  const faqMatch = findMatchingFaq(cleanMessage, faqData)

  if (faqMatch && faqMatch.score >= 2) {
    // High-confidence FAQ hit – pass through AI for natural rephrasing
    console.log(
      `[FAQ_HIT] id=${faqMatch.faq.id} score=${faqMatch.score} category=${faqMatch.faq.category}`
    )

    const OPENAI_KEY = process.env.OPENAI_API_KEY
    if (OPENAI_KEY) {
      // Use AI to rephrase the FAQ answer naturally
      try {
        const rephraseRes = await fetch(OPENAI_API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${OPENAI_KEY}`,
          },
          body: JSON.stringify({
            model: MODEL,
            messages: [
              {
                role: 'system',
                content: `Você é a Bia, atendente virtual simpática da ${clinicData.name}. Reescreva a resposta abaixo com suas próprias palavras, de forma natural e acolhedora, como se estivesse conversando pelo celular. Use no máximo 2-3 frases curtas. Termine com [WHATSAPP_CTA].`,
              },
              {
                role: 'user',
                content: `Pergunta do paciente: "${cleanMessage}"\n\nResposta base: "${faqMatch.faq.answer}"`,
              },
            ],
            max_tokens: 200,
            temperature: 0.7,
          }),
        })

        if (rephraseRes.ok) {
          const rephraseData = await rephraseRes.json()
          const rephrasedReply = rephraseData.choices?.[0]?.message?.content?.trim()
          if (rephrasedReply) {
            const finalFaqReply = rephrasedReply.includes('[WHATSAPP_CTA]')
              ? rephrasedReply
              : `${rephrasedReply}\n\n[WHATSAPP_CTA]`
            return res.status(200).json({
              reply: finalFaqReply,
              source: 'faq',
              remaining: sessionCheck.remaining,
            })
          }
        }
      } catch (err) {
        console.error('[FAQ_REPHRASE_ERROR]', err)
        // Fall through to static FAQ below
      }
    }

    // Fallback: return FAQ answer directly if AI rephrase fails
    const faqReply = `${faqMatch.faq.answer}\n\nSe quiser saber mais ou agendar, é só chamar no WhatsApp! [WHATSAPP_CTA]`
    return res.status(200).json({
      reply: faqReply,
      source: 'faq',
      remaining: sessionCheck.remaining,
    })
  }

  // ── 5. Build OpenAI request ────────────────────────────────────
  const OPENAI_KEY = process.env.OPENAI_API_KEY
  if (!OPENAI_KEY) {
    console.error('[ERROR] OPENAI_API_KEY not set')
    return res.status(500).json({
      error: 'Serviço temporariamente indisponível. Por favor, entre em contato pelo WhatsApp.',
    })
  }

  const systemPrompt = buildSystemPrompt(clinicData, faqData)

  // Sanitize and limit history
  const safeHistory = Array.isArray(history)
    ? history
        .filter(
          (m) =>
            m &&
            typeof m === 'object' &&
            ['user', 'assistant'].includes(m.role) &&
            typeof m.content === 'string'
        )
        .slice(-MAX_HISTORY_MESSAGES)
        .map((m) => ({
          role: m.role,
          content: sanitizeInput(m.content).slice(0, 1000),
        }))
    : []

  const messages = [
    { role: 'system', content: systemPrompt },
    ...safeHistory,
    { role: 'user', content: cleanMessage },
  ]

  // ── 6. Call OpenAI ─────────────────────────────────────────────
  let aiReply
  try {
    const openaiRes = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${OPENAI_KEY}`,
      },
      body: JSON.stringify({
        model: MODEL,
        messages,
        max_tokens: MAX_TOKENS,
        temperature: 0.65,
        frequency_penalty: 0.4,
      }),
    })

    if (!openaiRes.ok) {
      const errBody = await openaiRes.text()
      console.error(`[OPENAI_ERROR] status=${openaiRes.status} body=${errBody.slice(0, 200)}`)
      return res.status(502).json({
        error:
          'Não consegui processar sua mensagem agora. Tente novamente ou fale pelo WhatsApp.',
      })
    }

    const openaiData = await openaiRes.json()
    aiReply = openaiData.choices?.[0]?.message?.content?.trim()

    if (!aiReply) {
      throw new Error('Empty response from OpenAI')
    }

    console.log(
      `[OPENAI_OK] tokens=${openaiData.usage?.total_tokens} model=${openaiData.model}`
    )
  } catch (err) {
    console.error('[OPENAI_EXCEPTION]', err)
    return res.status(502).json({
      error:
        'Ocorreu um erro interno. Por favor, tente novamente ou entre em contato pelo WhatsApp. [WHATSAPP_CTA]',
    })
  }

  // Ensure the reply always ends with the WhatsApp CTA marker
  const finalReply = aiReply.includes('[WHATSAPP_CTA]')
    ? aiReply
    : `${aiReply}\n\n[WHATSAPP_CTA]`

  return res.status(200).json({
    reply: finalReply,
    source: 'ai',
    remaining: sessionCheck.remaining,
  })
}
