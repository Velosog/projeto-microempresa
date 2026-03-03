import clinic from '../../data/clinic.json'
import useScrollReveal from '../../hooks/useScrollReveal'
import SectionHeader from '../ui/SectionHeader'
import { ChatBubbleIcon, LightbulbIcon, CheckCircleIcon, SparklesIcon } from '../icons'

export default function HowItWorksSection() {
  const revealRef = useScrollReveal()
  const stepsRef = useScrollReveal(0.1)

  const steps = [
    {
      step: '01',
      title: 'Inicie uma conversa',
      description:
        'Clique no ícone de chat ou no botão de WhatsApp. Nosso assistente está disponível 24 horas.',
      icon: ChatBubbleIcon,
    },
    {
      step: '02',
      title: 'Receba orientação',
      description:
        'O assistente identifica sua necessidade e oferece as melhores opções de tratamento.',
      icon: LightbulbIcon,
    },
    {
      step: '03',
      title: 'Confirme seu horário',
      description:
        'Com um toque, você é direcionado ao WhatsApp para confirmar o agendamento.',
      icon: CheckCircleIcon,
    },
    {
      step: '04',
      title: 'Cuide do seu sorriso',
      description:
        'Compareça à consulta. Nossa equipe estará pronta para te receber com todo o cuidado.',
      icon: SparklesIcon,
    },
  ]

  return (
    <section className="py-24 md:py-32 px-5 bg-white relative overflow-hidden">
      {/* Background decoration */}
      <div
        className="absolute right-0 top-1/2 -translate-y-1/2 w-96 h-96 rounded-full blur-[120px] opacity-[0.04]"
        style={{ backgroundColor: clinic.primaryColor }}
      />

      <div className="relative max-w-7xl mx-auto">
        <div ref={revealRef} className="scroll-reveal">
          <SectionHeader
            eyebrow="Como funciona"
            title="Simples, rápido e humanizado"
            subtitle="Em poucos passos você agenda sua consulta e recebe atendimento de qualidade."
          />
        </div>

        <div ref={stepsRef} className="scroll-reveal scroll-reveal-children grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 mt-16">
          {steps.map((s, i) => (
            <div key={s.step} className="relative group">
              {/* Connector line */}
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute top-10 left-[calc(50%+40px)] w-[calc(100%-40px)] h-px bg-gradient-to-r from-gray-200 to-transparent" />
              )}

              <div className="relative bg-white rounded-2xl p-7 border border-gray-100/80 hover:border-gray-200 transition-all duration-500 hover:shadow-xl hover:shadow-black/[0.03] hover:-translate-y-1 text-center">
                {/* Step number */}
                <div className="relative w-16 h-16 mx-auto mb-5">
                  <div
                    className="absolute inset-0 rounded-2xl opacity-10"
                    style={{ backgroundColor: clinic.primaryColor }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <s.icon className="w-7 h-7" style={{ color: clinic.primaryColor }} />
                  </div>
                </div>

                <span
                  className="text-[11px] font-bold tracking-widest uppercase"
                  style={{ color: clinic.primaryColor }}
                >
                  Passo {s.step}
                </span>
                <h3 className="font-semibold text-gray-900 mt-2 mb-2.5 text-[15px]">{s.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{s.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
