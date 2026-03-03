import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import ErrorBoundary from '../ErrorBoundary'

function ThrowError() {
  throw new Error('Test error')
}

describe('ErrorBoundary', () => {
  it('renders children when there is no error', () => {
    render(
      <ErrorBoundary>
        <p>Content works</p>
      </ErrorBoundary>
    )
    expect(screen.getByText('Content works')).toBeInTheDocument()
  })

  it('renders fallback UI when a child throws', () => {
    // Suppress React error boundary console output
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {})

    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    )

    expect(screen.getByText('Algo deu errado')).toBeInTheDocument()
    expect(screen.getByText('Recarregar página')).toBeInTheDocument()

    spy.mockRestore()
  })
})
