import { useState, useEffect } from 'react'
import clinic from '../../data/clinic.json'
import { ToothIcon, WhatsAppIcon } from '../icons'

export default function NavBar({ whatsappUrl }) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      role="banner"
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
        scrolled
          ? 'bg-white/90 backdrop-blur-xl shadow-lg shadow-black/[0.03] border-b border-gray-100/80'
          : 'bg-transparent'
      }`}
    >
      {/* Skip to main content */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:bg-white focus:px-4 focus:py-2 focus:rounded-lg focus:shadow-lg focus:text-gray-900 focus:text-sm focus:font-semibold"
      >
        Ir para o conteúdo principal
      </a>
      <div className="max-w-7xl mx-auto px-5 md:px-10 h-20 flex items-center justify-between">
        {/* Logo */}
        <a href="#" aria-label={`${clinic.name} - Página inicial`} className="flex items-center gap-3 group">
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
        <nav aria-label="Navegação principal" className="hidden lg:flex items-center gap-8 text-[13px] font-medium text-gray-500">
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
          <WhatsAppIcon className="w-4 h-4" aria-hidden="true" />
          <span className="hidden sm:inline">Agendar consulta</span>
          <span className="sm:hidden">Agendar</span>
          <span className="sr-only"> via WhatsApp</span>
        </a>
      </div>
    </header>
  )
}
