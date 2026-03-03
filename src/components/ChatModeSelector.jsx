import clinic from '../data/clinic.json'

/**
 * Initial mode selector shown after the bot greeting.
 * Two premium-styled buttons: booking (qualification) or quick question.
 */
export default function ChatModeSelector({ onSelect }) {
  return (
    <div className="flex flex-col gap-2.5 my-2 animate-fade-in">
      <button
        onClick={() => onSelect('booking')}
        className="group flex items-center gap-3 w-full text-left px-4 py-3.5 rounded-2xl border-2 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
        style={{
          borderColor: clinic.primaryColor + '30',
          backgroundColor: clinic.primaryColor + '08',
          '--tw-ring-color': clinic.primaryColor,
        }}
      >
        <span
          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-lg transition-transform duration-300 group-hover:scale-110"
          style={{ backgroundColor: clinic.primaryColor + '15' }}
        >
          🦷
        </span>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-gray-900 leading-tight">
            Quero agendar / pré-triagem
          </p>
          <p className="text-xs text-gray-500 mt-0.5 leading-snug">
            Responda algumas perguntas rápidas
          </p>
        </div>
        <svg
          className="w-4 h-4 ml-auto flex-shrink-0 text-gray-300 transition-all duration-300 group-hover:translate-x-1"
          style={{ color: clinic.primaryColor }}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      <button
        onClick={() => onSelect('question')}
        className="group flex items-center gap-3 w-full text-left px-4 py-3.5 rounded-2xl border-2 border-gray-100 bg-gray-50/50 transition-all duration-300 hover:border-gray-200 hover:bg-gray-50 hover:shadow-lg hover:-translate-y-0.5 active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gray-400"
      >
        <span className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-lg bg-gray-100 transition-transform duration-300 group-hover:scale-110">
          💬
        </span>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-gray-900 leading-tight">
            Tenho uma dúvida rápida
          </p>
          <p className="text-xs text-gray-500 mt-0.5 leading-snug">
            Pergunte o que quiser sobre a clínica
          </p>
        </div>
        <svg
          className="w-4 h-4 ml-auto flex-shrink-0 text-gray-300 transition-all duration-300 group-hover:translate-x-1 group-hover:text-gray-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  )
}
