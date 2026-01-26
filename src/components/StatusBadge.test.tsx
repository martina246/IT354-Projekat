import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import StatusBadge from './StatusBadge'

describe('StatusBadge', () => {
  it('renders "Open" for status open', () => {
    render(<StatusBadge status="open" />)
    expect(screen.getByText('Open')).toBeInTheDocument()
  })

  it('renders "In progress" for status in_progress', () => {
    render(<StatusBadge status="in_progress" />)
    expect(screen.getByText('In progress')).toBeInTheDocument()
  })

  it('renders "Closed" for status closed', () => {
    render(<StatusBadge status="closed" />)
    expect(screen.getByText('Closed')).toBeInTheDocument()
  })

  it('renders raw status for unknown value', () => {
    render(<StatusBadge status={'unknown' as 'open'} />)
    expect(screen.getByText('unknown')).toBeInTheDocument()
  })

  it('applies variant class when variant is small', () => {
    const { container } = render(<StatusBadge status="open" variant="small" />)
    const span = container.querySelector('.status-badge-small')
    expect(span).toBeInTheDocument()
  })

  it('applies status class', () => {
    const { container } = render(<StatusBadge status="closed" />)
    const span = container.querySelector('.status-badge-closed')
    expect(span).toBeInTheDocument()
  })
})
