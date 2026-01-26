import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import OpenTicketModal from './OpenTicketModal'
import type { Ticket } from '../types/Ticket'

vi.mock('../api/tickets.api', () => ({
  updateTicketStatus: vi.fn(),
}))

import { updateTicketStatus } from '../api/tickets.api'

const updateTicketStatusMock = vi.mocked(updateTicketStatus)

const mockTicket: Ticket = {
  id: 't1',
  userId: 'u1',
  title: 'Test Ticket',
  description: 'Desc',
  status: 'open',
  createdAt: '2024-01-01T12:00:00',
  categoryId: '',
}

describe('OpenTicketModal', () => {
  const onClose = vi.fn()
  const onTicketUpdated = vi.fn()

  beforeEach(() => {
    updateTicketStatusMock.mockResolvedValue({ ...mockTicket, status: 'in_progress' })
  })

  it('returns null when isOpen is false', () => {
    const { container } = render(
      <OpenTicketModal isOpen={false} onClose={onClose} ticket={mockTicket} onTicketUpdated={onTicketUpdated} />
    )
    expect(container.firstChild).toBeNull()
  })

  it('returns null when ticket is null', () => {
    const { container } = render(
      <OpenTicketModal isOpen onClose={onClose} ticket={null} onTicketUpdated={onTicketUpdated} />
    )
    expect(container.firstChild).toBeNull()
  })

  it('renders ticket details when open', () => {
    render(<OpenTicketModal isOpen ticket={mockTicket} onClose={onClose} onTicketUpdated={onTicketUpdated} />)
    expect(screen.getByText('Ticket Details')).toBeInTheDocument()
    expect(screen.getByText('Test Ticket')).toBeInTheDocument()
    expect(screen.getByText('Desc')).toBeInTheDocument()
    expect(screen.getAllByText('Open').length).toBeGreaterThanOrEqual(1)
  })

  it('calls onClose when Close button clicked', async () => {
    const user = userEvent.setup()
    render(<OpenTicketModal isOpen ticket={mockTicket} onClose={onClose} onTicketUpdated={onTicketUpdated} />)
    await user.click(screen.getByRole('button', { name: /Close/i }))
    expect(onClose).toHaveBeenCalled()
  })

  it('calls updateTicketStatus, onTicketUpdated, onClose when Update Status clicked and status changed', async () => {
    const user = userEvent.setup()
    render(<OpenTicketModal isOpen ticket={mockTicket} onClose={onClose} onTicketUpdated={onTicketUpdated} />)
    await user.selectOptions(screen.getByRole('combobox'), 'in_progress')
    await user.click(screen.getByRole('button', { name: /Update Status/i }))

    await waitFor(() => {
      expect(updateTicketStatusMock).toHaveBeenCalledWith('t1', 'in_progress')
      expect(onTicketUpdated).toHaveBeenCalled()
      expect(onClose).toHaveBeenCalled()
    })
  })

  it('disables Update Status when status unchanged', () => {
    render(<OpenTicketModal isOpen ticket={mockTicket} onClose={onClose} onTicketUpdated={onTicketUpdated} />)
    const btn = screen.getByRole('button', { name: /Update Status/i })
    expect(btn).toBeDisabled()
  })
})
