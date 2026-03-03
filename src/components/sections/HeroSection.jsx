import clinic from '../../data/clinic.json'
import useScrollReveal from '../../hooks/useScrollReveal'
import { ToothIcon, WhatsAppIcon } from '../icons'

export default function HeroSection({ whatsappUrl }) {
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
