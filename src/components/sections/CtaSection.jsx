import clinic from '../../data/clinic.json'
import useScrollReveal from '../../hooks/useScrollReveal'
import { WhatsAppIcon } from '../icons'

export default function CtaSection({ whatsappUrl }) {
  const revealRef = useScrollReveal(0.1)

  return (
    <section id="contato" className="relative py-28 md:py-36 px-5 overflow-hidden">
      {/* Background gradient */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(135deg, ${clinic.primaryColor} 0%, ${clinic.primaryColorDark} 60%, #0f172a 100%)`,
        }}
      />

      {/* Decorative circles */}
      <div className="absolute top-10 left-10 w-64 h-64 border border-white/[0.06] rounded-full" />
      <div className="absolute top-10 left-10 w-96 h-96 border border-white/[0.04] rounded-full" />
      <div className="absolute -bottom-20 -right-20 w-80 h-80 border border-white/[0.06] rounded-full" />
      <div className="absolute top-1/2 right-[20%] w-3 h-3 bg-white/10 rounded-full" />
      <div className="absolute top-[30%] left-[15%] w-2 h-2 bg-white/10 rounded-full" />

      {/* Radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-white/[0.03] blur-[80px]" />

      <div ref={revealRef} className="scroll-reveal relative max-w-3xl mx-auto text-center text-white">
        <p className="text-white/50 text-xs font-semibold uppercase tracking-[0.25em] mb-6">
          Agende sua consulta
        </p>

        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] font-display font-bold leading-[1.15] mb-6">
          Pronto para transformar seu sorriso?
        </h2>

        <p className="text-white/60 text-lg max-w-xl mx-auto mb-10 leading-relaxed">
          Agende agora e ganhe uma avaliação completa na primeira consulta.
          Nossa equipe está esperando por você.
        </p>

        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex items-center gap-3 bg-white font-bold px-10 py-5 rounded-2xl transition-all duration-300 hover:shadow-2xl hover:shadow-black/20 hover:scale-[1.03] active:scale-[0.98] text-base"
          style={{ color: clinic.primaryColor }}
        >
          <WhatsAppIcon className="w-5 h-5" style={{ color: '#25D366' }} />
          Agendar pelo WhatsApp
          <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </a>

        <div className="mt-6 flex items-center justify-center gap-6 text-white/40 text-sm">
          <span>📍 {clinic.address.city} – {clinic.address.state}</span>
          <span className="w-1 h-1 rounded-full bg-white/20" />
          <span>{clinic.hours.weekdays}</span>
        </div>

        {/* Differentials grid */}
        <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 text-left max-w-lg mx-auto">
          {clinic.differentials.map((d) => (
            <div key={d} className="flex items-start gap-2.5 text-white/70 text-sm">
              <svg
                className="w-4 h-4 flex-shrink-0 mt-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                style={{ color: '#25D366' }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
              {d}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
