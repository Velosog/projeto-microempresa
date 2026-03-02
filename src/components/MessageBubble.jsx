import clinic from '../data/clinic.json'

/**
 * Renders a single message bubble in the chat window.
 * Supports 'user' and 'assistant' roles.
 * Detects the [WHATSAPP_CTA] marker and renders a CTA button.
 */
export default function MessageBubble({ message }) {
  const isUser = message.role === 'user'
  const isSystem = message.role === 'system'

  // Extract [WHATSAPP_CTA] marker from assistant messages
  const hasWhatsappCta =
    !isUser && message.content.includes('[WHATSAPP_CTA]')
  const displayContent = message.content
    .replace('[WHATSAPP_CTA]', '')
    .trim()

  const whatsappText = encodeURIComponent(
    'Olá! Vim pelo site e gostaria de agendar uma consulta.'
  )
  const whatsappUrl = `https://wa.me/${clinic.whatsapp}?text=${whatsappText}`

  if (isSystem) {
    return (
      <div className="flex justify-center my-2">
        <span className="text-xs text-gray-400 bg-gray-100 rounded-full px-3 py-1">
          {message.content}
        </span>
      </div>
    )
  }

  return (
    <div
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-3 animate-fade-in`}
    >
      {!isUser && (
        <div
          className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold mr-2 flex-shrink-0 mt-1"
          style={{ backgroundColor: clinic.primaryColor }}
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
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
        </div>
      )}

      <div className={`max-w-[80%] ${isUser ? 'order-first' : ''}`}>
        <div
          className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${
            isUser
              ? 'text-white rounded-br-sm'
              : 'bg-gray-100 text-gray-800 rounded-bl-sm'
          }`}
          style={
            isUser
              ? { backgroundColor: clinic.primaryColor }
              : {}
          }
        >
          {displayContent}
        </div>

        {hasWhatsappCta && (
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 flex items-center gap-2 text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-all duration-200 hover:opacity-90 active:scale-95 w-full justify-center"
            style={{ backgroundColor: '#25D366' }}
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Agendar pelo WhatsApp
          </a>
        )}

        <span className="text-xs text-gray-400 mt-1 block px-1">
          {formatTime(message.timestamp)}
        </span>
      </div>
    </div>
  )
}

function formatTime(timestamp) {
  if (!timestamp) return ''
  const date = new Date(timestamp)
  return date.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  })
}
