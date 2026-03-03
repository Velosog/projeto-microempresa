import { describe, it, expect } from 'vitest'
import formatPhone from '../formatPhone'

describe('formatPhone', () => {
  it('formats a 13-digit Brazilian phone number', () => {
    expect(formatPhone('5554996301102')).toBe('+55 (54) 9 9630-1102')
  })

  it('returns the original string for non-standard lengths', () => {
    expect(formatPhone('123')).toBe('123')
  })

  it('strips non-digit characters before formatting', () => {
    expect(formatPhone('+55 (54) 99630-1102')).toBe('+55 (54) 9 9630-1102')
  })
})
