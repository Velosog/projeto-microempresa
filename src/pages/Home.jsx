import { useEffect, useRef, useState, useCallback } from 'react'
import clinic from '../data/clinic.json'
import { buildWhatsAppUrl } from '../utils/whatsapp'

/**
 * Premium dental clinic landing page.
 * Scroll-reveal animations, glass effects, editorial layout.
 * Color driven by clinic.json via CSS variables.
 */
export default function Home() {
  useEffect(() => {
    const root = document.documentElement
    root.style.setProperty('--color-primary', clinic.primaryColor)
    root.style.setProperty('--color-primary-dark', clinic.primaryColorDark)
    root.style.setProperty('--color-primary-light', clinic.primaryColorLight)
    document.title = `${clinic.name} – Atendimento Odontológico 24h`
  }, [])

  const whatsappUrl = buildWhatsAppUrl()

  return (
    <main className="min-h-screen font-sans antialiased text-gray-900 bg-white overflow-x-hidden">
      <NavBar whatsappUrl={whatsappUrl} />
      <HeroSection whatsappUrl={whatsappUrl} />
      <BenefitsSection />
      <GallerySection />
      <HowItWorksSection />
      <ServicesSection />
      <InsuranceSection />
      <CtaSection whatsappUrl={whatsappUrl} />
      <Footer />
    </main>
  )
}

/* ──────────────────────────────────────────────
   SCROLL REVEAL HOOK
────────────────────────────────────────────── */
function useScrollReveal(threshold = 0.15) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('revealed')
          observer.unobserve(el)
        }
      },
      { threshold }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold])

  return ref
}

/* ──────────────────────────────────────────────
   NAV BAR — glass effect on scroll
────────────────────────────────────────────── */
function NavBar({ whatsappUrl }) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
        scrolled
          ? 'bg-white/90 backdrop-blur-xl shadow-lg shadow-black/[0.03] border-b border-gray-100/80'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-5 md:px-10 h-20 flex items-center justify-between">
        {/* Logo */}
        <a href="#" className="flex items-center gap-3 group">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-lg transition-transform duration-300 group-hover:scale-105"
            style={{
              backgroundColor: clinic.primaryColor,
              boxShadow: `0 4px 14px ${clinic.primaryColor}40`,
            }}
          >
            <ToothIcon className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-gray-900 text-lg tracking-tight leading-tight">
              {clinic.name}
            </span>
            <span className="text-[10px] text-gray-400 font-medium tracking-widest uppercase hidden sm:block">
              Odontologia de excelência
            </span>
          </div>
        </a>

        {/* Nav links */}
        <nav className="hidden lg:flex items-center gap-8 text-[13px] font-medium text-gray-500">
          {[
            { label: 'Sobre', href: '#beneficios' },
            { label: 'Galeria', href: '#galeria' },
            { label: 'Serviços', href: '#servicos' },
            { label: 'Convênios', href: '#convenios' },
            { label: 'Contato', href: '#contato' },
          ].map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="relative py-1 hover:text-gray-900 transition-colors duration-300 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:transition-all after:duration-300 hover:after:w-full"
              style={{ '--tw-after-bg': clinic.primaryColor }}
              onMouseEnter={(e) => (e.currentTarget.style.setProperty('--after-color', clinic.primaryColor))}
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* CTA */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-all duration-300 hover:shadow-lg hover:scale-[1.02] active:scale-95"
          style={{
            backgroundColor: '#25D366',
            boxShadow: '0 4px 14px rgba(37, 211, 102, 0.3)',
          }}
        >
          <WhatsAppIcon className="w-4 h-4" />
          <span className="hidden sm:inline">Agendar consulta</span>
          <span className="sm:hidden">Agendar</span>
        </a>
      </div>
    </header>
  )
}

/* ──────────────────────────────────────────────
   HERO — Two-column editorial layout
────────────────────────────────────────────── */
function HeroSection({ whatsappUrl }) {
  const revealRef = useScrollReveal(0.1)

  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-gray-50" />
      <div
        className="absolute top-0 right-0 w-[60%] h-full opacity-[0.04]"
        style={{
          background: `radial-gradient(circle at 70% 30%, ${clinic.primaryColor} 0%, transparent 60%)`,
        }}
      />

      {/* Floating decorative elements */}
      <div
        className="absolute top-32 right-[15%] w-72 h-72 rounded-full blur-[100px] opacity-[0.08] animate-float"
        style={{ backgroundColor: clinic.primaryColor }}
      />
      <div
        className="absolute bottom-20 left-[10%] w-48 h-48 rounded-full blur-[80px] opacity-[0.06] animate-float-delayed"
        style={{ backgroundColor: clinic.primaryColor }}
      />

      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `linear-gradient(${clinic.primaryColor} 1px, transparent 1px), linear-gradient(90deg, ${clinic.primaryColor} 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />

      <div ref={revealRef} className="scroll-reveal relative max-w-7xl mx-auto px-5 md:px-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center py-16 md:py-20">
          {/* Left — Text */}
          <div className="space-y-8">
            {/* Badge */}
            <div
              className="inline-flex items-center gap-2.5 text-xs font-semibold px-4 py-2 rounded-full tracking-wide uppercase"
              style={{
                color: clinic.primaryColor,
                backgroundColor: clinic.primaryColor + '0D',
                border: `1px solid ${clinic.primaryColor}20`,
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full animate-pulse"
                style={{ backgroundColor: clinic.primaryColor }}
              />
              Referência em odontologia
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-[3.5rem] font-display font-bold text-gray-900 leading-[1.1] tracking-tight">
              Seu sorriso em{' '}
              <span
                className="relative inline-block"
                style={{ color: clinic.primaryColor }}
              >
                boas mãos
                <svg
                  className="absolute -bottom-2 left-0 w-full"
                  viewBox="0 0 200 12"
                  fill="none"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M2 8c40-6 80-6 120-2s56 4 76-2"
                    stroke={clinic.primaryColor}
                    strokeWidth="3"
                    strokeLinecap="round"
                    opacity="0.3"
                  />
                </svg>
              </span>
            </h1>

            <p className="text-lg text-gray-500 leading-relaxed max-w-lg">
              Tratamentos personalizados com tecnologia de última geração.
              Aqui, cada detalhe é pensado para o seu conforto e bem-estar.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-start gap-4 pt-2">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 text-white font-semibold px-8 py-4 rounded-2xl transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] text-[15px]"
                style={{
                  backgroundColor: clinic.primaryColor,
                  boxShadow: `0 8px 30px ${clinic.primaryColor}30`,
                }}
              >
                <WhatsAppIcon className="w-5 h-5" />
                Agendar consulta
                <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
              <button
                onClick={() => document.querySelector('#beneficios')?.scrollIntoView({ behavior: 'smooth' })}
                className="flex items-center gap-2 font-medium px-6 py-4 rounded-2xl text-gray-600 hover:text-gray-900 hover:bg-gray-100/80 transition-all duration-300 text-[15px]"
              >
                Conheça a clínica
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>

            {/* Trust stats */}
            <div className="flex items-center gap-8 pt-6 border-t border-gray-100">
              {[
                { value: '4.9', label: 'Avaliação', suffix: '/5' },
                { value: '2k+', label: 'Pacientes' },
                { value: '15+', label: 'Anos de experiência' },
              ].map((stat) => (
                <div key={stat.label} className="text-center sm:text-left">
                  <p className="text-2xl font-bold text-gray-900 leading-none">
                    {stat.value}
                    {stat.suffix && <span className="text-sm font-normal text-gray-400">{stat.suffix}</span>}
                  </p>
                  <p className="text-xs text-gray-400 mt-1 font-medium">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right — Image placeholder */}
          <div className="relative hidden lg:block">
            {/* Main image placeholder */}
            <div
              className="relative rounded-3xl overflow-hidden aspect-[4/5] shadow-2xl"
              style={{ boxShadow: `0 25px 60px ${clinic.primaryColor}15, 0 0 0 1px rgba(0,0,0,0.03)` }}
            >
              <div
                className="absolute inset-0"
                style={{
                  background: `linear-gradient(135deg, ${clinic.primaryColorLight} 0%, ${clinic.primaryColor}15 50%, ${clinic.primaryColor}25 100%)`,
                }}
              />
              {/* Placeholder content */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
                <div
                  className="w-20 h-20 rounded-2xl flex items-center justify-center mb-4 shadow-lg"
                  style={{ backgroundColor: clinic.primaryColor + '15' }}
                >
                  <ToothIcon className="w-10 h-10" style={{ color: clinic.primaryColor }} />
                </div>
                <p className="text-sm font-medium text-gray-400 max-w-[200px]">
                  Insira aqui a foto principal da clínica ou do profissional
                </p>
                <p className="text-xs text-gray-300 mt-2">Recomendado: 800×1000px</p>
              </div>
            </div>

            {/* Floating card — appointments */}
            <div
              className="absolute -left-8 bottom-20 glass-card rounded-2xl p-4 shadow-xl animate-float"
              style={{ boxShadow: '0 20px 40px rgba(0,0,0,0.08)' }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: '#25D36615' }}
                >
                  <WhatsAppIcon className="w-5 h-5" style={{ color: '#25D366' }} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">Agende online</p>
                  <p className="text-xs text-gray-400">Resposta em minutos</p>
                </div>
              </div>
            </div>

            {/* Floating card — rating */}
            <div
              className="absolute -right-4 top-16 glass-card rounded-2xl p-4 shadow-xl animate-float-delayed"
              style={{ boxShadow: '0 20px 40px rgba(0,0,0,0.08)' }}
            >
              <div className="flex items-center gap-2">
                <div className="flex -space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-sm font-bold text-gray-900">4.9</span>
              </div>
              <p className="text-[11px] text-gray-400 mt-1">+200 avaliações</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ──────────────────────────────────────────────
   BENEFITS — "Por que escolher"
────────────────────────────────────────────── */
function BenefitsSection() {
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

/* ──────────────────────────────────────────────
   GALLERY — Photo portfolio section
────────────────────────────────────────────── */
function GallerySection() {
  const revealRef = useScrollReveal()
  const gridRef = useScrollReveal(0.1)

  const gallery = [
    { label: 'Recepção', aspect: 'aspect-[4/3]', desc: 'Ambiente moderno e acolhedor' },
    { label: 'Consultório', aspect: 'aspect-[3/4]', desc: 'Tecnologia de última geração' },
    { label: 'Equipe', aspect: 'aspect-[4/3]', desc: 'Profissionais especializados' },
    { label: 'Equipamentos', aspect: 'aspect-[4/3]', desc: 'Scanner digital e laser' },
    { label: 'Sala de espera', aspect: 'aspect-[3/4]', desc: 'Conforto para pacientes' },
    { label: 'Resultado', aspect: 'aspect-[4/3]', desc: 'Sorrisos transformados' },
  ]

  return (
    <section id="galeria" className="py-24 md:py-32 px-5 bg-gray-50/70">
      <div className="max-w-7xl mx-auto">
        <div ref={revealRef} className="scroll-reveal">
          <SectionHeader
            eyebrow="Nossa estrutura"
            title="Conheça o espaço"
            subtitle="Um ambiente projetado para oferecer conforto, tecnologia e segurança em cada atendimento."
          />
        </div>

        <div ref={gridRef} className="scroll-reveal scroll-reveal-children grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-5 mt-16">
          {gallery.map((item, i) => (
            <div
              key={item.label}
              className={`group relative ${item.aspect} rounded-2xl overflow-hidden cursor-pointer transition-all duration-500 hover:shadow-2xl hover:shadow-black/10 hover:-translate-y-1 hover:scale-[1.02]`}
            >
              {/* Placeholder gradient */}
              <div
                className="absolute inset-0 transition-transform duration-700 group-hover:scale-110"
                style={{
                  background: `linear-gradient(${135 + i * 30}deg, ${clinic.primaryColor}12 0%, ${clinic.primaryColor}25 50%, ${clinic.primaryColorDark}20 100%)`,
                }}
              />

              {/* Placeholder icon & text */}
              <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-3"
                  style={{ backgroundColor: clinic.primaryColor + '15' }}
                >
                  <CameraIcon className="w-6 h-6" style={{ color: clinic.primaryColor }} />
                </div>
                <p className="text-xs font-medium text-gray-500 text-center">{item.desc}</p>
                <p className="text-[10px] text-gray-300 mt-1">Inserir foto real</p>
              </div>

              {/* Hover overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              {/* Label on hover */}
              <div className="absolute bottom-0 left-0 right-0 p-5 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                <p className="text-white font-semibold text-sm">{item.label}</p>
                <p className="text-white/70 text-xs mt-0.5">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ──────────────────────────────────────────────
   HOW IT WORKS
────────────────────────────────────────────── */
function HowItWorksSection() {
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

/* ──────────────────────────────────────────────
   SERVICES
────────────────────────────────────────────── */
function ServicesSection() {
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
                onClick={() => handleToggle(i)}
                className={`group flex flex-col items-center text-center p-6 rounded-2xl bg-white border transition-all duration-500 cursor-pointer select-none ${
                  isOpen
                    ? 'border-gray-300 shadow-xl shadow-black/[0.05] -translate-y-1 ring-1'
                    : 'border-gray-100/80 hover:border-gray-200 hover:shadow-xl hover:shadow-black/[0.03] hover:-translate-y-1'
                }`}
                style={isOpen ? { '--tw-ring-color': clinic.primaryColor + '40' } : {}}
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

/* ──────────────────────────────────────────────
   INSURANCE
────────────────────────────────────────────── */
function InsuranceSection() {
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

/* ──────────────────────────────────────────────
   CTA FINAL
────────────────────────────────────────────── */
function CtaSection({ whatsappUrl }) {
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

/* ──────────────────────────────────────────────
   FOOTER
────────────────────────────────────────────── */
function Footer() {
  return (
    <footer className="bg-gray-950 text-gray-400 pt-16 pb-8 px-5">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-gray-800/60">
          {/* Brand */}
          <div className="md:col-span-4">
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center text-white"
                style={{ backgroundColor: clinic.primaryColor }}
              >
                <ToothIcon className="w-4 h-4" />
              </div>
              <span className="font-bold text-white text-lg">{clinic.name}</span>
            </div>
            <p className="text-sm leading-relaxed text-gray-500 max-w-xs">
              {clinic.tagline}. Atendimento humanizado com tecnologia de ponta para toda a família.
            </p>

            {/* Social */}
            <div className="flex items-center gap-3 mt-5">
              {clinic.socialMedia.instagram && (
                <a
                  href={clinic.socialMedia.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg bg-gray-800/60 flex items-center justify-center hover:bg-gray-700 transition-colors duration-300"
                >
                  <InstagramIcon className="w-4 h-4 text-gray-400" />
                </a>
              )}
              {clinic.socialMedia.facebook && (
                <a
                  href={clinic.socialMedia.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg bg-gray-800/60 flex items-center justify-center hover:bg-gray-700 transition-colors duration-300"
                >
                  <FacebookIcon className="w-4 h-4 text-gray-400" />
                </a>
              )}
            </div>
          </div>

          {/* Quick links */}
          <div className="md:col-span-2">
            <h4 className="text-white font-semibold mb-4 text-xs uppercase tracking-[0.15em]">
              Navegação
            </h4>
            <ul className="space-y-2.5 text-sm">
              {[
                { label: 'Sobre', href: '#beneficios' },
                { label: 'Galeria', href: '#galeria' },
                { label: 'Serviços', href: '#servicos' },
                { label: 'Convênios', href: '#convenios' },
              ].map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="hover:text-white transition-colors duration-300">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="md:col-span-3">
            <h4 className="text-white font-semibold mb-4 text-xs uppercase tracking-[0.15em]">
              Contato
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li className="flex items-start gap-2">
                <MapPinIcon className="w-4 h-4 mt-0.5 flex-shrink-0 text-gray-500" />
                <span>{clinic.address.street}, {clinic.address.neighborhood}<br />{clinic.address.city} – {clinic.address.state}</span>
              </li>
              <li className="flex items-center gap-2">
                <PhoneIcon className="w-4 h-4 flex-shrink-0 text-gray-500" />
                <a href={`tel:${clinic.phone}`} className="hover:text-white transition-colors duration-300">
                  {formatPhone(clinic.phone)}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <MailIcon className="w-4 h-4 flex-shrink-0 text-gray-500" />
                <a href={`mailto:${clinic.email}`} className="hover:text-white transition-colors duration-300">
                  {clinic.email}
                </a>
              </li>
            </ul>
          </div>

          {/* Hours */}
          <div className="md:col-span-3">
            <h4 className="text-white font-semibold mb-4 text-xs uppercase tracking-[0.15em]">
              Horários
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>{clinic.hours.weekdays}</li>
              <li>{clinic.hours.saturday}</li>
              <li>{clinic.hours.sunday}</li>
              <li className="text-xs mt-3 pt-3 border-t border-gray-800/60 text-gray-500">
                {clinic.hours.emergency}
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-600">
          <p>&copy; {new Date().getFullYear()} {clinic.name}. Todos os direitos reservados.</p>
          <p>Desenvolvido com tecnologia SaaS Dental Chatbot</p>
        </div>
      </div>
    </footer>
  )
}

/* ──────────────────────────────────────────────
   SHARED COMPONENTS
────────────────────────────────────────────── */
function SectionHeader({ eyebrow, title, subtitle }) {
  return (
    <div className="text-center max-w-2xl mx-auto">
      <p
        className="text-[11px] font-bold uppercase tracking-[0.2em] mb-4"
        style={{ color: clinic.primaryColor }}
      >
        {eyebrow}
      </p>
      <h2 className="text-3xl sm:text-4xl md:text-[2.5rem] font-display font-bold text-gray-900 mb-5 leading-tight tracking-tight">
        {title}
      </h2>
      {subtitle && (
        <p className="text-gray-500 text-base leading-relaxed max-w-xl mx-auto">{subtitle}</p>
      )}
    </div>
  )
}

/* ──────────────────────────────────────────────
   SVG ICONS — Clean, consistent line icons
────────────────────────────────────────────── */
function ToothIcon({ className = 'w-5 h-5', style }) {
  return (
    <svg className={className} style={style} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 2C8.5 2 6 4.5 6 7c0 2 .8 3.5 2 4.5V20c0 1.1.9 2 2 2h4c1.1 0 2-.9 2-2v-8.5c1.2-1 2-2.5 2-4.5 0-2.5-2.5-5-6-5z" />
    </svg>
  )
}

function WhatsAppIcon({ className = 'w-5 h-5', style }) {
  return (
    <svg className={className} style={style} fill="currentColor" viewBox="0 0 24 24">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  )
}

function ClockIcon({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2m6-2a10 10 0 11-20 0 10 10 0 0120 0z" />
    </svg>
  )
}

function CalendarIcon({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  )
}

function CardIcon({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
    </svg>
  )
}

function TechIcon({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  )
}

function HeartIcon({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>
  )
}

function ShieldIcon({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  )
}

function ChatBubbleIcon({ className, style }) {
  return (
    <svg className={className} style={style} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
  )
}

function LightbulbIcon({ className, style }) {
  return (
    <svg className={className} style={style} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
    </svg>
  )
}

function CheckCircleIcon({ className, style }) {
  return (
    <svg className={className} style={style} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )
}

function SparklesIcon({ className, style }) {
  return (
    <svg className={className} style={style} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>
  )
}

function CameraIcon({ className, style }) {
  return (
    <svg className={className} style={style} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  )
}

function MapPinIcon({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  )
}

function PhoneIcon({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
    </svg>
  )
}

function MailIcon({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  )
}

function InstagramIcon({ className }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  )
}

function FacebookIcon({ className }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  )
}

// Service-specific icons for visual variety
function GeneralIcon({ className }) {
  return <ToothIcon className={className} style={{ color: 'currentColor' }} />
}

function BracesIcon({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 8V6a2 2 0 012-2h2M4 16v2a2 2 0 002 2h2m8-16h2a2 2 0 012 2v2m0 8v2a2 2 0 01-2 2h-2" />
      <circle cx="9" cy="12" r="1" fill="currentColor" />
      <circle cx="15" cy="12" r="1" fill="currentColor" />
      <path strokeLinecap="round" d="M9 12h6" />
    </svg>
  )
}

function ImplantIcon({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v3m0 0l-2 1m2-1l2 1M8 10h8M9 13h6M10 16h4M11 19h2" />
    </svg>
  )
}

function WhiteningIcon({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707" />
      <circle cx="12" cy="12" r="4" />
    </svg>
  )
}

function CanalIcon({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
    </svg>
  )
}

function ProstheticsIcon({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 6v12a2 2 0 002 2h12a2 2 0 002-2V6M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2m-7 5h.01M15 11h.01M9 15h6" />
    </svg>
  )
}

function GumIcon({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>
  )
}

function ChildIcon({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )
}

function SurgeryIcon({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )
}

function AestheticIcon({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>
  )
}

/* ──────────────────────────────────────────────
   HELPERS
────────────────────────────────────────────── */
function formatPhone(phone) {
  const digits = phone.replace(/\D/g, '')
  if (digits.length === 13) {
    return `+${digits.slice(0, 2)} (${digits.slice(2, 4)}) ${digits.slice(4, 5)} ${digits.slice(5, 9)}-${digits.slice(9)}`
  }
  return phone
}
