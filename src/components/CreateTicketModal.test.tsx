import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import CreateTicketModal from './CreateTicketModal'

vi.mock('../context/AuthContext', () => ({
  useAuth: vi.fn(),
}))
vi.mock('../api/categories.api', () => ({
  getAllCategories: vi.fn(),
}))
vi.mock('../api/tickets.api', () => ({
  createTicket: vi.fn(),
}))

import { useAuth } from '../context/AuthContext'
import { getAllCategories } from '../api/categories.api'
import { createTicket } from '../api/tickets.api'

const useAuthMock = vi.mocked(useAuth)
const getAllCategoriesMock = vi.mocked(getAllCategories)
const createTicketMock = vi.mocked(createTicket)

describe('CreateTicketModal', () => {
  const onClose = vi.fn()
  const onTicketCreated = vi.fn()

  beforeEach(() => {
    useAuthMock.mockReturnValue({
      user: { id: 'u1', name: 'J', lastName: 'D', email: 'j@x.com', password: 'x', role: 'user' },
      login: vi.fn(),
      logout: vi.fn(),
      isAdmin: vi.fn(() => false),
      isLoading: false,
    } as ReturnType<typeof useAuth>)
    getAllCategoriesMock.mockResolvedValue([
      { id: 'c1', name: 'Bug', description: 'd', createdAt: '2024-01-01' },
    ])
    createTicketMock.mockResolvedValue({
      id: 't1',
      userId: 'u1',
      title: 'T',
      description: 'D',
      status: 'open',
      createdAt: '2024-01-01',
      categoryId: '',
    })
  })

  it('returns null when isOpen is false', () => {
    const { container } = render(
      <CreateTicketModal isOpen={false} onClose={onClose} onTicketCreated={onTicketCreated} />
    )
    expect(container.firstChild).toBeNull()
  })

  it('renders form when isOpen', async () => {
    render(<CreateTicketModal isOpen onClose={onClose} onTicketCreated={onTicketCreated} />)
    await waitFor(() => expect(getAllCategories).toHaveBeenCalled())
    expect(screen.getByText('Create New Ticket')).toBeInTheDocument()
    expect(screen.getAllByRole('textbox').length).toBeGreaterThanOrEqual(2)
    expect(screen.getByRole('combobox')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Create Ticket/i })).toBeInTheDocument()
  })

  it('calls onClose when Cancel is clicked', async () => {
    const user = userEvent.setup()
    render(<CreateTicketModal isOpen onClose={onClose} onTicketCreated={onTicketCreated} />)
    await waitFor(() => expect(getAllCategories).toHaveBeenCalled())
    await user.click(screen.getByRole('button', { name: /Cancel/i }))
    expect(onClose).toHaveBeenCalled()
  })

  it('calls onClose when close button (×) is clicked', async () => {
    const user = userEvent.setup()
    render(<CreateTicketModal isOpen onClose={onClose} onTicketCreated={onTicketCreated} />)
    await waitFor(() => expect(getAllCategories).toHaveBeenCalled())
    await user.click(screen.getByRole('button', { name: /×/ }))
    expect(onClose).toHaveBeenCalled()
  })

  it('submits with title, description, category and calls createTicket, onTicketCreated, onClose', async () => {
    const user = userEvent.setup()
    render(<CreateTicketModal isOpen onClose={onClose} onTicketCreated={onTicketCreated} />)
    await waitFor(() => expect(getAllCategories).toHaveBeenCalled())

    const [titleInput, descInput] = screen.getAllByRole('textbox')
    await user.type(titleInput, 'My Bug')
    await user.type(descInput, 'It crashes')
    await user.selectOptions(screen.getByRole('combobox'), 'c1')
    await user.click(screen.getByRole('button', { name: /Create Ticket/i }))

    await waitFor(() => {
      expect(createTicketMock).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: 'u1',
          title: 'My Bug',
          description: 'It crashes',
          status: 'open',
          categoryId: 'c1',
        })
      )
    })
    expect(onTicketCreated).toHaveBeenCalled()
    expect(onClose).toHaveBeenCalled()
  })
})
