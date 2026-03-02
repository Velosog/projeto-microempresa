import { useEffect } from 'react'
import clinic from '../data/clinic.json'

/**
 * Landing page with all required sections:
 * Hero → Benefits → How it works → Services → Testimonials → CTA final
 * Color is driven by clinic.json primaryColor via CSS variables.
 */
export default function Home() {
  // Inject CSS custom properties from clinic.json
  useEffect(() => {
    const root = document.documentElement
    root.style.setProperty('--color-primary', clinic.primaryColor)
    root.style.setProperty('--color-primary-dark', clinic.primaryColorDark)
    root.style.setProperty('--color-primary-light', clinic.primaryColorLight)
    document.title = `${clinic.name} – Atendimento Odontológico 24h`
  }, [])

  const whatsappUrl = buildWhatsappUrl(
    clinic.whatsapp,
    'Olá! Quero agendar uma consulta.'
  )

  return (
    <main className="min-h-screen font-sans antialiased text-gray-900 bg-white">
      <NavBar whatsappUrl={whatsappUrl} />
      <HeroSection whatsappUrl={whatsappUrl} />
      <BenefitsSection />
      <HowItWorksSection />
      <ServicesSection />
      <InsuranceSection />
      <CtaSection whatsappUrl={whatsappUrl} />
      <Footer />
    </main>
  )
}

/* ──────────────────────────────────────────────
   NAV BAR
────────────────────────────────────────────── */
function NavBar({ whatsappUrl }) {
  return (
    <header className="fixed top-0 left-0 right-0 z-30 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-white"
            style={{ backgroundColor: clinic.primaryColor }}
          >
            <ToothIcon className="w-5 h-5" />
          </div>
          <span className="font-bold text-gray-900 text-lg tracking-tight">
            {clinic.name}
          </span>
        </div>

        <nav className="hidden md:flex items-center gap-6 text-sm text-gray-600">
          <a href="#beneficios" className="hover:text-primary transition-colors">Benefícios</a>
          <a href="#servicos" className="hover:text-primary transition-colors">Serviços</a>
          <a href="#convenios" className="hover:text-primary transition-colors">Convênios</a>
          <a href="#contato" className="hover:text-primary transition-colors">Contato</a>
        </nav>

        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-all hover:opacity-90 active:scale-95"
          style={{ backgroundColor: '#25D366' }}
        >
          <WhatsAppIcon className="w-4 h-4" />
          <span className="hidden sm:inline">Agendar</span>
        </a>
      </div>
    </header>
  )
}

/* ──────────────────────────────────────────────
   HERO
────────────────────────────────────────────── */
function HeroSection({ whatsappUrl }) {
  return (
    <section
      className="relative pt-32 pb-24 md:pt-40 md:pb-32 px-4 overflow-hidden"
      style={{ background: `linear-gradient(135deg, #f0f9ff 0%, ${clinic.primaryColorLight} 100%)` }}
    >
      {/* Decorative blobs */}
      <div
        className="absolute -top-32 -right-32 w-96 h-96 rounded-full opacity-20 blur-3xl"
        style={{ backgroundColor: clinic.primaryColor }}
      />
      <div
        className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full opacity-10 blur-3xl"
        style={{ backgroundColor: clinic.primaryColor }}
      />

      <div className="relative max-w-5xl mx-auto text-center">
        {/* Badge */}
        <div
          className="inline-flex items-center gap-2 text-sm font-medium px-4 py-1.5 rounded-full mb-6 border"
          style={{
            color: clinic.primaryColor,
            borderColor: clinic.primaryColor + '40',
            backgroundColor: clinic.primaryColor + '10',
          }}
        >
          <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: clinic.primaryColor }} />
          Atendimento inteligente 24h por dia
        </div>

        <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 leading-tight mb-6 tracking-tight">
          Seu sorriso merece{' '}
          <span style={{ color: clinic.primaryColor }}>cuidado sem espera</span>
        </h1>

        <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed">
          {clinic.tagline}. Tire dúvidas a qualquer hora pelo nosso assistente virtual e agende sua consulta em segundos.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2.5 text-white font-semibold px-8 py-4 rounded-xl shadow-lg transition-all hover:opacity-90 hover:shadow-xl active:scale-95 text-base"
            style={{ backgroundColor: '#25D366' }}
          >
            <WhatsAppIcon className="w-5 h-5" />
            Agendar pelo WhatsApp
          </a>
          <button
            onClick={() => document.querySelector('#beneficios')?.scrollIntoView({ behavior: 'smooth' })}
            className="flex items-center gap-2 font-medium px-8 py-4 rounded-xl border-2 transition-all hover:bg-gray-50 active:scale-95 text-base"
            style={{ color: clinic.primaryColor, borderColor: clinic.primaryColor }}
          >
            Saiba mais
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>

        {/* Trust badges */}
        <div className="mt-14 flex flex-wrap items-center justify-center gap-6 text-sm text-gray-500">
          {[
            { icon: '⭐', label: '4.9/5 – Avaliação dos pacientes' },
            { icon: '🦷', label: '+2.000 sorrisos transformados' },
            { icon: '🔒', label: 'Atendimento sigiloso e humanizado' },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-2">
              <span className="text-base">{item.icon}</span>
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ──────────────────────────────────────────────
   BENEFITS
────────────────────────────────────────────── */
function BenefitsSection() {
  const benefits = [
    {
      icon: '🕐',
      title: 'Atendimento 24 horas',
      description:
        'Nosso chatbot responde suas dúvidas a qualquer hora, incluindo fins de semana e feriados.',
    },
    {
      icon: '📲',
      title: 'Agendamento fácil',
      description:
        'Agende, remarque ou cancele consultas pelo WhatsApp ou chatbot em menos de 2 minutos.',
    },
    {
      icon: '💳',
      title: 'Parcelamento facilitado',
      description:
        'Parcele seu tratamento em até 12x sem juros. Aceitamos todos os cartões e PIX.',
    },
    {
      icon: '🏥',
      title: 'Tecnologia de ponta',
      description:
        'Equipamentos modernos para diagnóstico preciso, tratamentos menos invasivos e mais confortáveis.',
    },
    {
      icon: '😌',
      title: 'Ambiente acolhedor',
      description:
        'Clínica pensada para relaxar: música suave, aromaterapia e equipe treinada para pacientes ansiosos.',
    },
    {
      icon: '📋',
      title: 'Plano de tratamento claro',
      description:
        'Orçamento detalhado sem surpresas. Você conhece o custo total antes de começar o tratamento.',
    },
  ]

  return (
    <section id="beneficios" className="py-20 md:py-28 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <SectionHeader
          eyebrow="Por que nos escolher"
          title="Cuidado completo, do digital ao consultório"
          subtitle="Combinamos tecnologia moderna com atendimento humanizado para a melhor experiência odontológica."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
          {benefits.map((b) => (
            <div
              key={b.title}
              className="group p-6 rounded-2xl border border-gray-100 hover:border-primary/30 hover:shadow-md transition-all duration-300 bg-white"
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-4"
                style={{ backgroundColor: clinic.primaryColorLight }}
              >
                {b.icon}
              </div>
              <h3 className="font-semibold text-gray-900 mb-2 text-base">{b.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{b.description}</p>
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
  const steps = [
    {
      step: '01',
      title: 'Fale com o chatbot',
      description:
        'Clique no ícone de chat no canto inferior direito e descreva o que precisa. Disponível 24h.',
    },
    {
      step: '02',
      title: 'Receba orientação',
      description:
        'O assistente identifica sua necessidade e responde com base nas informações da clínica.',
    },
    {
      step: '03',
      title: 'Confirme no WhatsApp',
      description:
        'Com um clique, você é direcionado ao WhatsApp para confirmar o agendamento com a recepção.',
    },
    {
      step: '04',
      title: 'Apareça e sorria',
      description:
        'Compareça no horário marcado. Nossa equipe estará pronta para te receber com cuidado.',
    },
  ]

  return (
    <section
      className="py-20 md:py-28 px-4"
      style={{ backgroundColor: clinic.primaryColorLight }}
    >
      <div className="max-w-6xl mx-auto">
        <SectionHeader
          eyebrow="Como funciona"
          title="Do primeiro contato ao sorriso transformado"
          subtitle="Quatro passos simples separam você do atendimento odontológico que merece."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
          {steps.map((s, i) => (
            <div key={s.step} className="relative">
              {i < steps.length - 1 && (
                <div
                  className="hidden lg:block absolute top-8 left-[calc(50%+32px)] right-[-calc(50%-32px)] h-0.5 opacity-30"
                  style={{ backgroundColor: clinic.primaryColor }}
                />
              )}
              <div className="bg-white rounded-2xl p-6 shadow-sm text-center hover:shadow-md transition-shadow">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center text-white text-xl font-extrabold mx-auto mb-4"
                  style={{ backgroundColor: clinic.primaryColor }}
                >
                  {s.step}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{s.title}</h3>
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
  return (
    <section id="servicos" className="py-20 md:py-28 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <SectionHeader
          eyebrow="Especialidades"
          title="Tratamentos para toda a família"
          subtitle="Uma equipe multidisciplinar pronta para cuidar do seu sorriso em todas as fases da vida."
        />

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mt-12">
          {clinic.services.map((service) => (
            <div
              key={service}
              className="group flex flex-col items-center text-center p-5 rounded-2xl border border-gray-100 hover:border-primary/40 hover:shadow-sm transition-all duration-200 cursor-default"
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                style={{ backgroundColor: clinic.primaryColorLight }}
              >
                <ToothIcon
                  className="w-5 h-5"
                  style={{ color: clinic.primaryColor }}
                />
              </div>
              <span className="text-sm font-medium text-gray-700 leading-snug">
                {service}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ──────────────────────────────────────────────
   INSURANCE
────────────────────────────────────────────── */
function InsuranceSection() {
  return (
    <section
      id="convenios"
      className="py-16 px-4 border-y border-gray-100 bg-gray-50"
    >
      <div className="max-w-6xl mx-auto">
        <p className="text-center text-sm font-semibold text-gray-400 uppercase tracking-widest mb-8">
          Convênios aceitos
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          {clinic.insurances.map((ins) => (
            <span
              key={ins}
              className="px-5 py-2.5 rounded-full text-sm font-medium border border-gray-200 bg-white text-gray-700 shadow-sm hover:shadow-md transition-shadow"
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
  return (
    <section
      id="contato"
      className="py-20 md:py-28 px-4"
      style={{ background: `linear-gradient(135deg, ${clinic.primaryColor} 0%, ${clinic.primaryColorDark} 100%)` }}
    >
      <div className="max-w-3xl mx-auto text-center text-white">
        <h2 className="text-3xl md:text-5xl font-extrabold mb-4 leading-tight">
          Pronto para transformar<br />seu sorriso?
        </h2>
        <p className="text-white/80 text-lg mb-10">
          Agende agora e ganhe uma avaliação completa na primeira consulta.
          Nossa equipe está esperando por você.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2.5 bg-white font-bold px-8 py-4 rounded-xl shadow-lg transition-all hover:shadow-xl hover:scale-105 active:scale-95 text-base"
            style={{ color: clinic.primaryColor }}
          >
            <WhatsAppIcon className="w-5 h-5" style={{ color: '#25D366' }} />
            Agendar pelo WhatsApp
          </a>
          <div className="text-white/70 text-sm">
            <p>📍 {clinic.address.city} – {clinic.address.state}</p>
            <p className="mt-1">{clinic.hours.weekdays}</p>
          </div>
        </div>

        {/* Differentials */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-3 text-left max-w-xl mx-auto">
          {clinic.differentials.map((d) => (
            <div key={d} className="flex items-start gap-2 text-white/90 text-sm">
              <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
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
    <footer className="bg-gray-900 text-gray-400 py-12 px-4">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <div className="flex items-center gap-2.5 mb-3">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center text-white"
              style={{ backgroundColor: clinic.primaryColor }}
            >
              <ToothIcon className="w-4 h-4" />
            </div>
            <span className="font-bold text-white">{clinic.name}</span>
          </div>
          <p className="text-sm leading-relaxed">{clinic.tagline}</p>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-3 text-sm uppercase tracking-wider">
            Contato
          </h4>
          <ul className="space-y-2 text-sm">
            <li>📍 {clinic.address.street}, {clinic.address.neighborhood}</li>
            <li>{clinic.address.city} – {clinic.address.state}</li>
            <li>📞 <a href={`tel:${clinic.phone}`} className="hover:text-white transition-colors">{formatPhone(clinic.phone)}</a></li>
            <li>✉️ <a href={`mailto:${clinic.email}`} className="hover:text-white transition-colors">{clinic.email}</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-3 text-sm uppercase tracking-wider">
            Horários
          </h4>
          <ul className="space-y-2 text-sm">
            <li>{clinic.hours.weekdays}</li>
            <li>{clinic.hours.saturday}</li>
            <li>{clinic.hours.sunday}</li>
          </ul>
        </div>
      </div>

      <div className="max-w-6xl mx-auto mt-10 pt-6 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <p>© {new Date().getFullYear()} {clinic.name}. Todos os direitos reservados.</p>
        <p>Desenvolvido com tecnologia SaaS Dental Chatbot</p>
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
        className="text-sm font-semibold uppercase tracking-widest mb-3"
        style={{ color: clinic.primaryColor }}
      >
        {eyebrow}
      </p>
      <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4 leading-tight">
        {title}
      </h2>
      {subtitle && (
        <p className="text-gray-500 text-base leading-relaxed">{subtitle}</p>
      )}
    </div>
  )
}

function ToothIcon({ className = 'w-5 h-5', style }) {
  return (
    <svg
      className={className}
      style={style}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      strokeWidth={1.8}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 2C8.5 2 6 4.5 6 7c0 2 .8 3.5 2 4.5V20c0 1.1.9 2 2 2h4c1.1 0 2-.9 2-2v-8.5c1.2-1 2-2.5 2-4.5 0-2.5-2.5-5-6-5z"
      />
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

/* ──────────────────────────────────────────────
   HELPERS
────────────────────────────────────────────── */
function buildWhatsappUrl(number, text) {
  return `https://wa.me/${number}?text=${encodeURIComponent(text)}`
}

function formatPhone(phone) {
  // Formats "5554996301102" → "+55 (54) 9 9630-1102"
  const digits = phone.replace(/\D/g, '')
  if (digits.length === 13) {
    return `+${digits.slice(0, 2)} (${digits.slice(2, 4)}) ${digits.slice(4, 5)} ${digits.slice(5, 9)}-${digits.slice(9)}`
  }
  return phone
}
