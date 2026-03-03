import { useEffect } from 'react'
import clinic from '../data/clinic.json'
import { buildWhatsAppUrl } from '../utils/whatsapp'

import NavBar from '../components/sections/NavBar'
import HeroSection from '../components/sections/HeroSection'
import BenefitsSection from '../components/sections/BenefitsSection'
import GallerySection from '../components/sections/GallerySection'
import HowItWorksSection from '../components/sections/HowItWorksSection'
import ServicesSection from '../components/sections/ServicesSection'
import InsuranceSection from '../components/sections/InsuranceSection'
import CtaSection from '../components/sections/CtaSection'
import Footer from '../components/sections/Footer'

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
