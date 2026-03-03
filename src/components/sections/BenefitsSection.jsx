import clinic from '../../data/clinic.json'
import useScrollReveal from '../../hooks/useScrollReveal'
import SectionHeader from '../ui/SectionHeader'
import {
  ClockIcon, CalendarIcon, CardIcon,
  TechIcon, HeartIcon, ShieldIcon,
} from '../icons'

export default function BenefitsSection() {
  const revealRef = useScrollReveal()
  const cardsRef = useScrollReveal(0.1)

  const benefits = [
    {
      icon: ClockIcon,
      title: 'Atendimento 24 horas',
      description:
        'Nosso assistente virtual responde suas dúvidas a qualquer hora, incluindo fins de semana e feriados.',
    },
    {
      icon: CalendarIcon,
      title: 'Agendamento simplificado',
      description:
        'Agende, remarque ou cancele consultas pelo WhatsApp ou chatbot em menos de 2 minutos.',
    },
    {
      icon: CardIcon,
      title: 'Condições facilitadas',
      description:
        'Parcele seu tratamento em até 12x sem juros. Aceitamos cartões, PIX e transferência.',
    },
    {
      icon: TechIcon,
      title: 'Tecnologia de ponta',
      description:
        'Equipamentos de última geração para diagnóstico preciso e tratamentos minimamente invasivos.',
    },
    {
      icon: HeartIcon,
      title: 'Ambiente acolhedor',
      description:
        'Clínica projetada para seu conforto: equipe preparada para pacientes com qualquer nível de ansiedade.',
    },
    {
      icon: ShieldIcon,
      title: 'Transparência total',
      description:
        'Orçamento detalhado antes de qualquer procedimento. Sem surpresas, sem custos ocultos.',
    },
  ]

  return (
    <section id="beneficios" className="py-24 md:py-32 px-5 bg-white relative">
      {/* Subtle background accent */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full blur-[150px] opacity-[0.04]"
        style={{ backgroundColor: clinic.primaryColor }}
      />

      <div className="relative max-w-7xl mx-auto">
        <div ref={revealRef} className="scroll-reveal">
          <SectionHeader
            eyebrow="Por que nos escolher"
            title="Excelência em cada detalhe"
            subtitle="Combinamos tecnologia avançada, profissionais especializados e atendimento humanizado para entregar a melhor experiência odontológica."
          />
        </div>

        <div ref={cardsRef} className="scroll-reveal scroll-reveal-children grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-16">
          {benefits.map((b) => (
            <div
              key={b.title}
              className="group relative p-7 rounded-2xl border border-gray-100/80 bg-white hover:bg-gray-50/50 transition-all duration-500 hover:shadow-xl hover:shadow-black/[0.03] hover:-translate-y-1 cursor-default"
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-all duration-300 group-hover:scale-110"
                style={{
                  backgroundColor: clinic.primaryColor + '0D',
                  color: clinic.primaryColor,
                }}
              >
                <b.icon className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2.5 text-[15px]">{b.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{b.description}</p>

              {/* Subtle corner accent on hover */}
              <div
                className="absolute top-0 right-0 w-20 h-20 rounded-bl-[40px] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ backgroundColor: clinic.primaryColor + '05' }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
