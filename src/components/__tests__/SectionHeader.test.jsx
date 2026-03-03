import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import SectionHeader from '../ui/SectionHeader'

describe('SectionHeader', () => {
  it('renders eyebrow, title and subtitle', () => {
    render(
      <SectionHeader
        eyebrow="Test Eyebrow"
        title="Test Title"
        subtitle="Test Subtitle"
      />
    )

    expect(screen.getByText('Test Eyebrow')).toBeInTheDocument()
    expect(screen.getByText('Test Title')).toBeInTheDocument()
    expect(screen.getByText('Test Subtitle')).toBeInTheDocument()
  })

  it('does not render subtitle when not provided', () => {
    render(
      <SectionHeader
        eyebrow="Eye"
        title="Title"
      />
    )

    expect(screen.getByText('Eye')).toBeInTheDocument()
    expect(screen.getByText('Title')).toBeInTheDocument()
  })
})
