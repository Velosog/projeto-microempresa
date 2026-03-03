import { useState } from 'react'
import clinic from '../../data/clinic.json'
import useScrollReveal from '../../hooks/useScrollReveal'
import SectionHeader from '../ui/SectionHeader'
import {
  ToothIcon, GeneralIcon, BracesIcon, ImplantIcon,
  WhiteningIcon, CanalIcon, ProstheticsIcon,
  GumIcon, ChildIcon, SurgeryIcon, AestheticIcon,
} from '../icons'

export default function ServicesSection() {
  const revealRef = useScrollReveal()
  const gridRef = useScrollReveal(0.1)
  const [openIndex, setOpenIndex] = useState(null)

  const serviceDetails = [
    { icon: GeneralIcon, desc: 'Consultas de rotina, limpezas, restaurações e check-ups preventivos para manter sua saúde bucal em dia.' },
    { icon: BracesIcon, desc: 'Aparelhos fixos, móveis e alinhadores transparentes para corrigir a posição dos dentes e melhorar sua mordida.' },
    { icon: ImplantIcon, desc: 'Substituição de dentes perdidos com pinos de titânio e coroas de porcelana. Resultado natural e duradouro.' },
    { icon: WhiteningIcon, desc: 'Clareamento profissional a laser ou com moldeira personalizada. Resultados visíveis em poucas sessões.' },
    { icon: CanalIcon, desc: 'Remoção da polpa infectada para salvar o dente, eliminando a dor e evitando a extração.' },
    { icon: ProstheticsIcon, desc: 'Próteses parciais, totais ou sobre implantes para devolver função mastigatória e estética ao sorriso.' },
    { icon: GumIcon, desc: 'Tratamento de gengivite, periodontite e retração gengival. Cuide da base que sustenta seus dentes.' },
    { icon: ChildIcon, desc: 'Atendimento lúdico e acolhedor para crianças, com foco em prevenção e criação de bons hábitos desde cedo.' },
    { icon: SurgeryIcon, desc: 'Extrações, remoção de sisos, cirurgias de enxerto ósseo e procedimentos pré-protéticos.' },
    { icon: AestheticIcon, desc: 'Lentes de contato dental, facetas em porcelana e harmonização do sorriso para um visual impecável.' },
  ]

  function handleToggle(i) {
    setOpenIndex(openIndex === i ? null : i)
  }

  return (
    <section id="servicos" className="py-24 md:py-32 px-5 bg-gray-50/70">
      <div className="max-w-7xl mx-auto">
        <div ref={revealRef} className="scroll-reveal">
          <SectionHeader
            eyebrow="Especialidades"
            title="Tratamentos completos"
            subtitle="Uma equipe multidisciplinar pronta para cuidar do seu sorriso em todas as fases da vida. Clique em um serviço para saber mais."
          />
        </div>

        <div ref={gridRef} className="scroll-reveal scroll-reveal-children grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-5 mt-16">
          {clinic.services.map((service, i) => {
            const detail = serviceDetails[i] || { icon: ToothIcon, desc: '' }
            const Icon = detail.icon
            const isOpen = openIndex === i
            return (
              <div
                key={service}
                role="button"
                tabIndex={0}
                aria-expanded={isOpen}
                aria-label={`${service} – clique para ${isOpen ? 'fechar' : 'ver'} detalhes`}
                onClick={() => handleToggle(i)}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleToggle(i) } }}
                className={`group flex flex-col items-center text-center p-6 rounded-2xl bg-white border transition-all duration-500 cursor-pointer select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
                  isOpen
                    ? 'border-gray-300 shadow-xl shadow-black/[0.05] -translate-y-1 ring-1'
                    : 'border-gray-100/80 hover:border-gray-200 hover:shadow-xl hover:shadow-black/[0.03] hover:-translate-y-1'
                }`}
                style={isOpen ? { '--tw-ring-color': clinic.primaryColor + '40' } : { '--tw-ring-color': clinic.primaryColor + '60' }}
              >
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-all duration-300 ${
                    isOpen ? 'scale-110' : 'group-hover:scale-110'
                  }`}
                  style={{
                    backgroundColor: isOpen ? clinic.primaryColor + '1A' : clinic.primaryColor + '0D',
                    color: clinic.primaryColor,
                  }}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <span className={`text-[13px] font-medium leading-snug transition-colors duration-300 ${
                  isOpen ? 'text-gray-900' : 'text-gray-700'
                }`}>
                  {service}
                </span>

                {/* Expandable description */}
                <div
                  className={`overflow-hidden transition-all duration-400 ease-out ${
                    isOpen ? 'max-h-40 opacity-100 mt-3' : 'max-h-0 opacity-0 mt-0'
                  }`}
                >
                  <div className="pt-3 border-t border-gray-100">
                    <p className="text-xs text-gray-500 leading-relaxed">
                      {detail.desc}
                    </p>
                  </div>
                </div>

                {/* Expand indicator */}
                <svg
                  className={`w-4 h-4 mt-2 text-gray-300 transition-transform duration-300 ${
                    isOpen ? 'rotate-180 text-gray-500' : 'group-hover:text-gray-400'
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
