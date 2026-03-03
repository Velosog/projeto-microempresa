import { useState, useEffect, useRef, useCallback } from 'react'
import MessageBubble from './MessageBubble'
import clinic from '../data/clinic.json'
import { buildWhatsAppUrl, saveLeadData, getLeadData } from '../utils/whatsapp'

const MAX_SESSION_MESSAGES = clinic.chatbot.maxMessages ?? 20
const SESSION_ID_KEY = 'dental_chat_session_id'

function getOrCreateSessionId() {
  let id = sessionStorage.getItem(SESSION_ID_KEY)
  if (!id) {
    id = `sess_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`
    sessionStorage.setItem(SESSION_ID_KEY, id)
  }
  return id
}

/**
 * Lead qualification questions asked naturally after the greeting.
 * Each entry maps a leadData key to a conversational question.
 */
const LEAD_QUESTIONS = [
  { key: 'procedure', question: 'Para começar, qual procedimento ou tratamento você está buscando?' },
  { key: 'urgency', question: 'Entendi! E essa questão é urgente ou pode aguardar um agendamento normal?' },
  { key: 'firstTime', question: 'É a sua primeira vez aqui na clínica?' },
  { key: 'insurance', question: 'Você utiliza algum convênio ou prefere atendimento particular?' },
  { key: 'preferredTime', question: 'Qual o melhor dia e turno para você? (manhã, tarde...)' },
  { key: 'complaint', question: 'Por último, pode resumir sua principal queixa em uma frase curta?' },
]

/**
 * The full chat window: message list + input bar.
 * Handles API calls, session state, typing indicators,
 * and lead qualification flow.
 */
export default function ChatWindow({ onClose }) {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isBlocked, setIsBlocked] = useState(false)
  const [blockedMessage, setBlockedMessage] = useState('')
  const [sessionId] = useState(getOrCreateSessionId)
  const [leadData, setLeadData] = useState(() => getLeadData())
  const [qualifyStep, setQualifyStep] = useState(0) // 0..5 = asking, 6+ = done
  const [qualifyDone, setQualifyDone] = useState(false)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)
  const hasGreeted = useRef(false)

  // Auto-scroll to bottom on new messages
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, scrollToBottom])

  // Persist lead data whenever it changes
  useEffect(() => {
    saveLeadData(leadData)
  }, [leadData])

  // Send greeting + first qualification question on first open
  useEffect(() => {
    if (hasGreeted.current) return
    hasGreeted.current = true

    const greeting = {
      id: crypto.randomUUID(),
      role: 'assistant',
      content: clinic.chatbot.greeting,
      timestamp: Date.now(),
    }
    setMessages([greeting])

    // Show first qualification question shortly after greeting
    setTimeout(() => {
      const firstQ = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: LEAD_QUESTIONS[0].question,
        timestamp: Date.now(),
      }
      setMessages((prev) => [...prev, firstQ])
    }, 800)

    setTimeout(() => inputRef.current?.focus(), 400)
  }, [])

  // Push subsequent qualification questions (step 1+)
  useEffect(() => {
    if (qualifyDone || qualifyStep === 0 || qualifyStep >= LEAD_QUESTIONS.length) return

    const timer = setTimeout(() => {
      const q = LEAD_QUESTIONS[qualifyStep]
      const botMsg = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: q.question,
        timestamp: Date.now(),
      }
      setMessages((prev) => [...prev, botMsg])
    }, 500)

    return () => clearTimeout(timer)
  }, [qualifyStep, qualifyDone])

  function advanceQualification(text) {
    const currentQ = LEAD_QUESTIONS[qualifyStep]
    if (!currentQ) return

    // Save the answer
    setLeadData((prev) => ({ ...prev, [currentQ.key]: text }))

    const nextStep = qualifyStep + 1
    if (nextStep >= LEAD_QUESTIONS.length) {
      // Qualification complete — send summary + WhatsApp CTA
      setQualifyDone(true)
      setQualifyStep(nextStep)

      setTimeout(() => {
        const summaryMsg = {
          id: crypto.randomUUID(),
          role: 'assistant',
          content:
            'Perfeito! Já tenho todas as informações para agilizar seu atendimento. ' +
            'Clique no botão abaixo para falar diretamente com a equipe pelo WhatsApp — ' +
            'sua mensagem já vai preenchida com tudo que conversamos! [WHATSAPP_CTA]',
          timestamp: Date.now(),
        }
        setMessages((prev) => [...prev, summaryMsg])
      }, 500)
    } else {
      setQualifyStep(nextStep)
    }
  }

  async function sendMessage(e) {
    e.preventDefault()
    const text = input.trim()
    if (!text || isLoading || isBlocked) return

    const userMsg = {
      id: crypto.randomUUID(),
      role: 'user',
      content: text,
      timestamp: Date.now(),
    }

    setMessages((prev) => [...prev, userMsg])
    setInput('')

    // If qualification is still in progress, handle locally (no API call)
    if (!qualifyDone && qualifyStep < LEAD_QUESTIONS.length) {
      advanceQualification(text)
      return
    }

    // After qualification is done, send to API
    setIsLoading(true)

    try {
      const historyForApi = messages
        .filter((m) => m.role !== 'system')
        .slice(-10)
        .map(({ role, content }) => ({ role, content }))

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Session-ID': sessionId,
        },
        body: JSON.stringify({
          message: text,
          history: historyForApi,
          sessionId,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        if (res.status === 429) {
          setIsBlocked(true)
          setBlockedMessage(
            data.error ||
              'Limite de mensagens atingido. Continue pelo WhatsApp.'
          )
        }
        const errMsg = {
          id: crypto.randomUUID(),
          role: 'assistant',
          content:
            data.error ||
            'Desculpe, ocorreu um erro. Tente novamente ou entre em contato pelo WhatsApp. [WHATSAPP_CTA]',
          timestamp: Date.now(),
        }
        setMessages((prev) => [...prev, errMsg])
        return
      }

      // Try to extract lead info from AI responses
      extractLeadHints(data.reply, text)

      const assistantMsg = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: data.reply,
        timestamp: Date.now(),
      }
      setMessages((prev) => [...prev, assistantMsg])

      if (data.remaining === 0 || messages.length + 2 >= MAX_SESSION_MESSAGES) {
        setIsBlocked(true)
        setBlockedMessage(
          'Você atingiu o limite desta sessão. Continue pelo WhatsApp!'
        )
      }
    } catch {
      const errMsg = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content:
          'Houve um problema de conexão. Verifique sua internet e tente novamente, ou fale conosco pelo WhatsApp. [WHATSAPP_CTA]',
        timestamp: Date.now(),
      }
      setMessages((prev) => [...prev, errMsg])
    } finally {
      setIsLoading(false)
      inputRef.current?.focus()
    }
  }

  /**
   * Tries to infer lead data from free conversation with the AI.
   * This enriches the WhatsApp pre-fill even after qualification.
   */
  function extractLeadHints(reply, userText) {
    const lower = userText.toLowerCase()
    setLeadData((prev) => {
      const updated = { ...prev }
      const services = clinic.services.map((s) => s.toLowerCase())
      for (const svc of services) {
        if (lower.includes(svc.split(' ')[0].toLowerCase())) {
          updated.procedure = updated.procedure || svc
          break
        }
      }
      for (const ins of clinic.insurances) {
        if (lower.includes(ins.toLowerCase())) {
          updated.insurance = updated.insurance || ins
          break
        }
      }
      return updated
    })
  }

  const whatsappUrl = buildWhatsAppUrl(leadData)

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3 text-white rounded-t-2xl flex-shrink-0"
        style={{ backgroundColor: clinic.primaryColor }}
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
              />
            </svg>
          </div>
          <div>
            <p className="font-semibold text-sm">{clinic.name}</p>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 bg-green-400 rounded-full inline-block" />
              <span className="text-xs text-white/80">Online agora</span>
            </div>
          </div>
        </div>
        <button
          onClick={onClose}
          className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 transition-colors flex items-center justify-center"
          aria-label="Fechar chat"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 bg-white space-y-1">
        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} leadData={leadData} />
        ))}

        {isLoading && <TypingIndicator />}

        <div ref={messagesEndRef} />
      </div>

      {/* Blocked state */}
      {isBlocked && (
        <div className="px-4 py-3 bg-amber-50 border-t border-amber-200 flex-shrink-0">
          <p className="text-xs text-amber-700 text-center mb-2">
            {blockedMessage}
          </p>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 text-white text-sm font-medium py-2.5 rounded-xl transition-all hover:opacity-90"
            style={{ backgroundColor: '#25D366' }}
          >
            <WhatsAppIcon />
            Continuar no WhatsApp
          </a>
        </div>
      )}

      {/* Input */}
      {!isBlocked && (
        <form
          onSubmit={sendMessage}
          className="flex items-center gap-2 px-3 py-3 bg-gray-50 border-t border-gray-200 rounded-b-2xl flex-shrink-0"
        >
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              !qualifyDone
                ? 'Responda aqui...'
                : 'Digite sua mensagem...'
            }
            maxLength={500}
            disabled={isLoading}
            className="flex-1 bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary transition-colors disabled:opacity-50 placeholder-gray-400"
            style={{ '--tw-ring-color': clinic.primaryColor }}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="w-10 h-10 rounded-xl flex items-center justify-center text-white transition-all hover:opacity-90 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
            style={{ backgroundColor: clinic.primaryColor }}
            aria-label="Enviar mensagem"
          >
            <svg
              className="w-5 h-5 -rotate-90"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
            </svg>
          </button>
        </form>
      )}
    </div>
  )
}

function TypingIndicator() {
  return (
    <div className="flex justify-start mb-3 animate-fade-in">
      <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs mr-2 flex-shrink-0 mt-1" style={{ backgroundColor: clinic.primaryColor }}>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      </div>
      <div className="bg-gray-100 rounded-2xl rounded-bl-sm px-4 py-3 flex items-center gap-1.5">
        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
      </div>
    </div>
  )
}

function WhatsAppIcon() {
  return (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  )
}
