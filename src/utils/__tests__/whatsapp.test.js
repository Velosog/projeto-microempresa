import { describe, it, expect, beforeEach } from 'vitest'
import { renderTemplate, buildWhatsAppUrl } from '../whatsapp'

describe('renderTemplate', () => {
  it('replaces placeholders with provided data', () => {
    const template = 'Olá, quero {procedure}'
    const result = renderTemplate(template, { procedure: 'limpeza' })
    expect(result).toBe('Olá, quero limpeza')
  })

  it('replaces missing fields with "(não informado)"', () => {
    const template = 'Urgência: {urgency}'
    const result = renderTemplate(template, {})
    expect(result).toBe('Urgência: (não informado)')
  })
})

describe('buildWhatsAppUrl', () => {
  beforeEach(() => {
    sessionStorage.clear()
    localStorage.clear()
  })

  it('returns a valid wa.me URL', () => {
    const url = buildWhatsAppUrl()
    expect(url).toMatch(/^https:\/\/wa\.me\//)
  })

  it('encodes the message in the URL', () => {
    const url = buildWhatsAppUrl({ procedure: 'clareamento' })
    expect(url).toContain('text=')
  })
})
