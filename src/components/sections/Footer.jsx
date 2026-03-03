import clinic from '../../data/clinic.json'
import formatPhone from '../../utils/formatPhone'
import {
  ToothIcon, InstagramIcon, FacebookIcon,
  MapPinIcon, PhoneIcon, MailIcon,
} from '../icons'

export default function Footer() {
  return (
    <footer role="contentinfo" aria-label="Rodapé" className="bg-gray-950 text-gray-400 pt-16 pb-8 px-5">
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
