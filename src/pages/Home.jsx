import { useClinic } from '../context/ClinicContext'
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
 * Color driven by clinic.json via CSS variables (set in ClinicProvider).
 */
export default function Home() {
  const { whatsappUrl } = useClinic()

  return (
    <main id="main-content" className="min-h-screen font-sans antialiased text-gray-900 bg-white overflow-x-hidden">
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
