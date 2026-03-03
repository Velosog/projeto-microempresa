import clinic from '../data/clinic.json'

const ADMIN_TEMPLATE_KEY = 'dental_whatsapp_template'
const ADMIN_FALLBACK_KEY = 'dental_whatsapp_fallback'
const LEAD_DATA_KEY = 'dental_lead_data'

/**
 * Retrieves the current WhatsApp prefill template,
 * checking localStorage for admin overrides first.
 */
export function getTemplate() {
  return localStorage.getItem(ADMIN_TEMPLATE_KEY) || clinic.whatsappPrefillTemplate
}

/**
 * Retrieves the current fallback template,
 * checking localStorage for admin overrides first.
 */
export function getFallback() {
  return localStorage.getItem(ADMIN_FALLBACK_KEY) || clinic.whatsappPrefillFallback
}

/**
 * Saves admin overrides to localStorage.
 */
export function saveTemplateOverrides(template, fallback) {
  if (template) localStorage.setItem(ADMIN_TEMPLATE_KEY, template)
  if (fallback) localStorage.setItem(ADMIN_FALLBACK_KEY, fallback)
}

/**
 * Resets admin overrides, reverting to clinic.json defaults.
 */
export function resetTemplateOverrides() {
  localStorage.removeItem(ADMIN_TEMPLATE_KEY)
  localStorage.removeItem(ADMIN_FALLBACK_KEY)
}

/**
 * Persists lead data to sessionStorage so it survives
 * component re-renders but clears on tab close.
 */
export function saveLeadData(data) {
  sessionStorage.setItem(LEAD_DATA_KEY, JSON.stringify(data))
}

/**
 * Retrieves persisted lead data.
 */
export function getLeadData() {
  try {
    return JSON.parse(sessionStorage.getItem(LEAD_DATA_KEY)) || {}
  } catch {
    return {}
  }
}

/**
 * Replaces {placeholders} in a template string with data values.
 * Missing fields are replaced with a dash. Produces natural-sounding text.
 */
export function renderTemplate(template, data = {}) {
  // Normalize firstTime to a natural phrase
  let firstTimeText = data.firstTime || ''
  if (firstTimeText) {
    const lower = firstTimeText.toLowerCase()
    if (lower.includes('sim') || lower.includes('primeira') || lower.includes('nunca')) {
      firstTimeText = 'É minha primeira vez na clínica.'
    } else if (lower.includes('não') || lower.includes('já')) {
      firstTimeText = 'Já sou paciente da clínica.'
    }
  }

  const merged = {
    clinicName: clinic.name,
    procedure: data.procedure || '',
    urgency: data.urgency || '',
    firstTime: firstTimeText,
    insurance: data.insurance || '',
    preferredTime: data.preferredTime || '',
    complaint: data.complaint || '',
  }

  // Replace placeholders; remove sentences with empty fields instead of showing "(não informado)"
  let result = template.replace(/\{(\w+)\}/g, (match, key) => {
    const value = merged[key]
    if (value === undefined || value === '') return ''
    return value
  })

  // Clean up lines where the field was empty (e.g. "Convênio: \n" → removed)
  result = result
    .split('\n')
    .filter((line) => {
      const trimmed = line.trim()
      // Remove lines that are just a label with no value (e.g. "Convênio: " or "Queixa: ")
      if (/^.+:\s*$/.test(trimmed)) return false
      // Remove completely empty lines only if consecutive
      return true
    })
    .join('\n')
    .replace(/\n{3,}/g, '\n\n') // max 1 blank line between sections
    .trim()

  return result
}

/**
 * Returns true if the lead data has at least 2 filled fields
 * (enough to justify using the detailed template).
 */
function hasEnoughData(data) {
  const fields = ['procedure', 'urgency', 'firstTime', 'insurance', 'preferredTime', 'complaint']
  const filled = fields.filter((f) => data[f] && data[f].trim()).length
  return filled >= 2
}

/**
 * Builds the full WhatsApp URL with pre-filled message.
 * Uses the detailed template if enough lead data exists,
 * otherwise falls back to a simpler greeting.
 */
export function buildWhatsAppUrl(leadData = null) {
  const data = leadData || getLeadData()
  const template = hasEnoughData(data) ? getTemplate() : getFallback()
  const message = renderTemplate(template, data)
  return `https://wa.me/${clinic.whatsapp}?text=${encodeURIComponent(message)}`
}
