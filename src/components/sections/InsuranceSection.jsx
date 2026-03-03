import clinic from '../../data/clinic.json'
import useScrollReveal from '../../hooks/useScrollReveal'

export default function InsuranceSection() {
  const revealRef = useScrollReveal()

  return (
    <section id="convenios" className="py-20 md:py-24 px-5 bg-white">
      <div ref={revealRef} className="scroll-reveal max-w-7xl mx-auto">
        <p className="text-center text-[11px] font-semibold text-gray-400 uppercase tracking-[0.2em] mb-10">
          Convênios e planos aceitos
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          {clinic.insurances.map((ins) => (
            <span
              key={ins}
              className="px-6 py-3 rounded-xl text-sm font-medium border border-gray-150 bg-gray-50/80 text-gray-600 hover:bg-white hover:shadow-lg hover:shadow-black/[0.04] hover:border-gray-200 hover:-translate-y-0.5 transition-all duration-300 cursor-default"
            >
              {ins}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
