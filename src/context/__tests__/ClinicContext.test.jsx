import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ClinicProvider, useClinic } from '../ClinicContext'

function TestConsumer() {
  const { clinic, whatsappUrl } = useClinic()
  return (
    <div>
      <span data-testid="name">{clinic.name}</span>
      <span data-testid="url">{whatsappUrl}</span>
    </div>
  )
}

describe('ClinicContext', () => {
  it('provides clinic data and whatsappUrl to consumers', () => {
    render(
      <ClinicProvider>
        <TestConsumer />
      </ClinicProvider>
    )

    expect(screen.getByTestId('name').textContent).toBeTruthy()
    expect(screen.getByTestId('url').textContent).toMatch(/wa\.me/)
  })

  it('throws when useClinic is used outside provider', () => {
    expect(() => render(<TestConsumer />)).toThrow(
      'useClinic must be used within a ClinicProvider'
    )
  })
})
