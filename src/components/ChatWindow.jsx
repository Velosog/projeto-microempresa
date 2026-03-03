import { useState, useEffect, useRef, useCallback } from 'react'
import MessageBubble from './MessageBubble'
import ChatModeSelector from './ChatModeSelector'
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
 * Lead qualification questions with contextual acknowledgments.
 * Each entry maps a leadData key to a question and human-like reactions.
 * The `acks` array provides varied, empathetic acknowledgments based on user's answer.
 */
const LEAD_QUESTIONS = [
  {
    key: 'procedure',
    question: 'Me conta, o que você tá precisando? Pode ser limpeza, aparelho, clareamento... fica à vontade!',
    acks: [
      (ans) => `Ah, ${ans.toLowerCase().includes('clareamento') ? 'clareamento é super procurado aqui!' : ans.toLowerCase().includes('aparelho') || ans.toLowerCase().includes('ortodontia') ? 'ortodontia muda demais o sorriso, viu!' : 'boa escolha!'}`,
      () => 'Que bom que veio falar com a gente!',
      () => 'Perfeito, anotei aqui!',
    ],
  },
  {
    key: 'urgency',
    question: 'E como tá essa situação — tá te incomodando muito ou dá pra esperar um pouquinho pra agendar com calma?',
    acks: [
      (ans) => ans.toLowerCase().includes('urgent') || ans.toLowerCase().includes('dor') || ans.toLowerCase().includes('muito')
        ? 'Entendo, vamos tentar encaixar o quanto antes então!'
        : 'Tranquilo, vamos achar o melhor horário pra você.',
      () => 'Tá anotado!',
    ],
  },
  {
    key: 'firstTime',
    question: 'Você já veio aqui na clínica antes ou seria a primeira vez?',
    acks: [
      (ans) => ans.toLowerCase().includes('primeira') || ans.toLowerCase().includes('não') || ans.toLowerCase().includes('nunca')
        ? 'Que legal, vai gostar! O pessoal aqui é muito atencioso.'
        : 'Que bom te ter de volta!',
      () => 'Show!',
    ],
  },
  {
    key: 'insurance',
    question: 'Você tem algum convênio ou prefere particular? Aceitamos Unimed, Bradesco, SulAmérica e outros.',
    acks: [
      (ans) => ans.toLowerCase().includes('particular') ? 'Sem problema, e a gente parcela em até 12x!' : 'Ótimo, vou anotar aqui.',
      () => 'Beleza!',
    ],
  },
  {
    key: 'preferredTime',
    question: 'Qual horário fica melhor pra você? De manhã, à tarde... algum dia da semana de preferência?',
    acks: [
      () => 'Perfeito, vou passar isso pro pessoal da agenda.',
      () => 'Anotado!',
    ],
  },
  {
    key: 'complaint',
    question: 'Pra finalizar, me conta rapidinho: qual é a principal queixa ou o que mais te incomoda?',
    acks: [
      () => 'Obrigado por compartilhar! Isso ajuda muito na hora da consulta.',
      () => 'Entendi direitinho.',
    ],
  },
]

/**
 * Picks a random acknowledgment from the question's acks array.
 */
function getAck(questionIndex, userAnswer) {
  const q = LEAD_QUESTIONS[questionIndex]
  if (!q || !q.acks || q.acks.length === 0) return ''
  const ack = q.acks[Math.floor(Math.random() * q.acks.length)]
  return typeof ack === 'function' ? ack(userAnswer) : ack
}

/**
 * Keywords that suggest the user in "question" mode wants to book.
 * When detected, the bot offers to switch to booking mode.
 */
const BOOKING_HINTS = [
  'agendar', 'agendamento', 'marcar', 'consulta', 'horário',
  'horario', 'disponível', 'disponivel', 'vaga', 'atender',
]

/**
 * The full chat window: message list + input bar.
 * Handles API calls, session state, typing indicators,
 * lead qualification flow, and chatMode selection.
 *
 * chatMode: null (awaiting selection) | "booking" | "question"
 */
export default function ChatWindow({ onClose }) {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isBlocked, setIsBlocked] = useState(false)
  const [blockedMessage, setBlockedMessage] = useState('')
  const [sessionId] = useState(getOrCreateSessionId)
  const [leadData, setLeadData] = useState(() => getLeadData())
  const [qualifyStep, setQualifyStep] = useState(0)
  const [qualifyDone, setQualifyDone] = useState(false)
  const [chatMode, setChatMode] = useState(null) // null | "booking" | "question"
  const [showModeSelector, setShowModeSelector] = useState(false)
  const [hasOfferedBooking, setHasOfferedBooking] = useState(false)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)
  const hasGreeted = useRef(false)

  // Auto-scroll to bottom on new messages
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, showModeSelector, scrollToBottom])

  // Persist lead data whenever it changes
  useEffect(() => {
    saveLeadData(leadData)
  }, [leadData])

  // Send greeting on first open, then show mode selector
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

    // Show mode selector after a brief delay
    setTimeout(() => {
      setShowModeSelector(true)
    }, 600)
  }, [])

  // Push subsequent qualification questions (step 1+) in booking mode
  useEffect(() => {
    if (chatMode !== 'booking') return
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
    }, 900)

    return () => clearTimeout(timer)
  }, [qualifyStep, qualifyDone, chatMode])

  /**
   * Called when user picks a mode from the selector buttons.
   */
  function handleModeSelect(mode) {
    setChatMode(mode)
    setShowModeSelector(false)

    if (mode === 'booking') {
      // Start qualification flow with a warm intro
      setTimeout(() => {
        const introMsg = {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: 'Ótimo, vou te ajudar com isso! Vou fazer umas perguntinhas rápidas pra já adiantar tudo pro seu atendimento, tá?',
          timestamp: Date.now(),
        }
        setMessages((prev) => [...prev, introMsg])

        setTimeout(() => {
          const firstQ = {
            id: crypto.randomUUID(),
            role: 'assistant',
            content: LEAD_QUESTIONS[0].question,
            timestamp: Date.now(),
          }
          setMessages((prev) => [...prev, firstQ])
          inputRef.current?.focus()
        }, 800)
      }, 400)
    } else {
      // Question mode — warm and inviting
      setTimeout(() => {
        const promptMsg = {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: 'Pode mandar! Tô aqui pra tirar qualquer dúvida — seja sobre tratamentos, valores, convênios, horários... o que precisar!',
          timestamp: Date.now(),
        }
        setMessages((prev) => [...prev, promptMsg])
        inputRef.current?.focus()
      }, 400)
    }
  }

  /**
   * When in question mode, detect if user mentions booking-related keywords.
   * If so, offer to switch to booking mode (only once).
   */
  function checkForBookingIntent(userText) {
    if (chatMode !== 'question' || hasOfferedBooking) return false
    const lower = userText.toLowerCase()
    const wantsBooking = BOOKING_HINTS.some((hint) => lower.includes(hint))
    if (wantsBooking) {
      setHasOfferedBooking(true)
      setTimeout(() => {
        setShowModeSelector(true)
        const offerMsg = {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: 'Opa, quer agendar? Posso te ajudar rapidinho com isso! Ou se preferir, continua perguntando aqui mesmo, sem problema.',
          timestamp: Date.now(),
        }
        setMessages((prev) => [...prev, offerMsg])
      }, 800)
      return true
    }
    return false
  }

  function advanceQualification(text) {
    const currentQ = LEAD_QUESTIONS[qualifyStep]
    if (!currentQ) return

    // Save the answer
    setLeadData((prev) => ({ ...prev, [currentQ.key]: text }))

    const nextStep = qualifyStep + 1
    const ack = getAck(qualifyStep, text)

    if (nextStep >= LEAD_QUESTIONS.length) {
      // Qualification complete — warm closing + WhatsApp CTA
      setQualifyDone(true)
      setQualifyStep(nextStep)

      setTimeout(() => {
        const closingMsg = {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: ack
            ? `${ack} Pronto, já tenho tudo que preciso!`
            : 'Pronto, já tenho tudo que preciso!',
          timestamp: Date.now(),
        }
        setMessages((prev) => [...prev, closingMsg])

        setTimeout(() => {
          const ctaMsg = {
            id: crypto.randomUUID(),
            role: 'assistant',
            content:
              'Agora é só clicar no botão abaixo pra falar com a equipe pelo WhatsApp. ' +
              'A mensagem já vai prontinha com tudo que a gente conversou aqui! [WHATSAPP_CTA]',
            timestamp: Date.now(),
          }
          setMessages((prev) => [...prev, ctaMsg])
        }, 600)
      }, 500)
    } else {
      // Show acknowledgment + next question with natural delay
      setQualifyStep(nextStep)

      if (ack) {
        setTimeout(() => {
          const ackMsg = {
            id: crypto.randomUUID(),
            role: 'assistant',
            content: ack,
            timestamp: Date.now(),
          }
          setMessages((prev) => [...prev, ackMsg])
        }, 400)
      }
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

    // If in booking mode and qualification is still in progress, handle locally
    if (chatMode === 'booking' && !qualifyDone && qualifyStep < LEAD_QUESTIONS.length) {
      advanceQualification(text)
      return
    }

    // In question mode, check if user wants to book
    if (chatMode === 'question') {
      const offered = checkForBookingIntent(text)
      if (offered) return // Wait for mode re-selection
    }

    // Send to API (after qualification or in question mode)
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

  // Determine input placeholder based on current state
  function getPlaceholder() {
    if (!chatMode) return 'Escolha uma opção acima...'
    if (chatMode === 'booking' && !qualifyDone) return 'Responda aqui...'
    return 'Digite sua mensagem...'
  }

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

        {/* Mode selector (shown after greeting or when booking is offered) */}
        {showModeSelector && (
          <ChatModeSelector onSelect={handleModeSelect} />
        )}

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
            placeholder={getPlaceholder()}
            maxLength={500}
            disabled={isLoading || !chatMode}
            className="flex-1 bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary transition-colors disabled:opacity-50 placeholder-gray-400"
            style={{ '--tw-ring-color': clinic.primaryColor }}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading || !chatMode}
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
