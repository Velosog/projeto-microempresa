import { createContext, useContext, useEffect, useMemo } from 'react'
import clinicData from '../data/clinic.json'
import { buildWhatsAppUrl } from '../utils/whatsapp'

const ClinicContext = createContext(null)

export function ClinicProvider({ children }) {
  const whatsappUrl = useMemo(() => buildWhatsAppUrl(), [])

  useEffect(() => {
    const root = document.documentElement
    root.style.setProperty('--color-primary', clinicData.primaryColor)
    root.style.setProperty('--color-primary-dark', clinicData.primaryColorDark)
    root.style.setProperty('--color-primary-light', clinicData.primaryColorLight)
    document.title = `${clinicData.name} – Atendimento Odontológico 24h`
  }, [])

  const value = useMemo(() => ({
    clinic: clinicData,
    whatsappUrl,
  }), [whatsappUrl])

  return (
    <ClinicContext.Provider value={value}>
      {children}
    </ClinicContext.Provider>
  )
}

export function useClinic() {
  const ctx = useContext(ClinicContext)
  if (!ctx) {
    throw new Error('useClinic must be used within a ClinicProvider')
  }
  return ctx
}
