/**
 * Formats a Brazilian phone number string for display.
 * Input: "5554996301102" → "+55 (54) 9 9630-1102"
 */
export default function formatPhone(phone) {
  const digits = phone.replace(/\D/g, '')
  if (digits.length === 13) {
    return `+${digits.slice(0, 2)} (${digits.slice(2, 4)}) ${digits.slice(4, 5)} ${digits.slice(5, 9)}-${digits.slice(9)}`
  }
  return phone
}
