import { useState, useEffect } from 'react'
import ChatWindow from './ChatWindow'
import clinic from '../data/clinic.json'

const TOOLTIP_DELAY_MS = 3000
const TOOLTIP_HIDE_KEY = 'dental_chat_tooltip_hidden'

/**
 * Floating chat bubble fixed to the bottom-right corner.
 * Opens/closes the ChatWindow modal on click.
 * Shows a pulsing notification ring and tooltip on first visit.
 */
export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [showTooltip, setShowTooltip] = useState(false)
  const [hasUnread, setHasUnread] = useState(true)

  useEffect(() => {
    const hidden = sessionStorage.getItem(TOOLTIP_HIDE_KEY)
    if (hidden) return

    const timer = setTimeout(() => {
      setShowTooltip(true)
    }, TOOLTIP_DELAY_MS)

    return () => clearTimeout(timer)
  }, [])

  function handleOpen() {
    setIsOpen(true)
    setShowTooltip(false)
    setHasUnread(false)
    sessionStorage.setItem(TOOLTIP_HIDE_KEY, '1')
  }

  function handleClose() {
    setIsOpen(false)
  }

  return (
    <>
      {/* Backdrop overlay on mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 md:hidden"
          onClick={handleClose}
        />
      )}

      {/* Chat window */}
      <div
        className={`fixed z-50 transition-all duration-300 ease-out ${
          isOpen
            ? 'opacity-100 scale-100 pointer-events-auto'
            : 'opacity-0 scale-95 pointer-events-none'
        } bottom-24 right-4 md:right-6 w-[calc(100vw-2rem)] md:w-[380px] h-[560px] md:h-[580px] max-h-[calc(100vh-7rem)] bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden`}
      >
        <ChatWindow onClose={handleClose} />
      </div>

      {/* Tooltip */}
      {showTooltip && !isOpen && (
        <div className="fixed bottom-24 right-20 md:right-24 z-50 animate-slide-up">
          <div className="bg-gray-900 text-white text-sm rounded-xl px-4 py-2.5 shadow-lg max-w-[200px] text-center leading-snug">
            Olá! Posso te ajudar? 👋
            <div className="absolute right-[-6px] top-1/2 -translate-y-1/2 w-0 h-0 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent border-l-[6px] border-l-gray-900" />
          </div>
        </div>
      )}

      {/* Floating bubble button */}
      <div className="fixed bottom-5 right-4 md:right-6 z-50">
        {/* Pulse ring */}
        {hasUnread && !isOpen && (
          <span
            className="absolute inset-0 rounded-full animate-pulse-ring"
            style={{ backgroundColor: clinic.primaryColor, opacity: 0.4 }}
          />
        )}

        <button
          onClick={isOpen ? handleClose : handleOpen}
          className="relative w-14 h-14 rounded-full shadow-lg flex items-center justify-center text-white transition-all duration-200 hover:scale-110 active:scale-95 focus:outline-none focus:ring-4 focus:ring-offset-2"
          style={{
            backgroundColor: clinic.primaryColor,
            '--tw-ring-color': clinic.primaryColor,
          }}
          aria-label={isOpen ? 'Fechar chat' : 'Abrir chat'}
          aria-expanded={isOpen}
        >
          {/* Unread badge */}
          {hasUnread && !isOpen && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white" />
          )}

          {/* Icon toggle with transition */}
          <span
            className={`absolute transition-all duration-300 ${
              isOpen ? 'opacity-100 rotate-0' : 'opacity-0 rotate-90'
            }`}
          >
            <svg
              className="w-6 h-6"
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
          </span>
          <span
            className={`absolute transition-all duration-300 ${
              isOpen ? 'opacity-0 -rotate-90' : 'opacity-100 rotate-0'
            }`}
          >
            <svg
              className="w-6 h-6"
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
          </span>
        </button>
      </div>
    </>
  )
}
