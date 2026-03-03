import { lazy, Suspense } from 'react'
import { useClinic } from '../context/ClinicContext'
import NavBar from '../components/sections/NavBar'
import HeroSection from '../components/sections/HeroSection'

// Lazy-load below-the-fold sections for faster initial paint
const BenefitsSection = lazy(() => import('../components/sections/BenefitsSection'))
const GallerySection = lazy(() => import('../components/sections/GallerySection'))
const HowItWorksSection = lazy(() => import('../components/sections/HowItWorksSection'))
const ServicesSection = lazy(() => import('../components/sections/ServicesSection'))
const InsuranceSection = lazy(() => import('../components/sections/InsuranceSection'))
const CtaSection = lazy(() => import('../components/sections/CtaSection'))
const Footer = lazy(() => import('../components/sections/Footer'))

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
      <Suspense fallback={null}>
        <BenefitsSection />
        <GallerySection />
        <HowItWorksSection />
        <ServicesSection />
        <InsuranceSection />
        <CtaSection whatsappUrl={whatsappUrl} />
        <Footer />
      </Suspense>
    </main>
  )
}
