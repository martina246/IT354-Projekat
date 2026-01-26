import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Home from './Home'

vi.mock('../context/AuthContext', () => ({ useAuth: vi.fn() }))
vi.mock('../api/tickets.api', () => ({ getUserTickets: vi.fn() }))

import { useAuth } from '../context/AuthContext'
import { getUserTickets } from '../api/tickets.api'

const useAuthMock = vi.mocked(useAuth)
const getUserTicketsMock = vi.mocked(getUserTickets)

describe('Home', () => {
  const mockUser = { id: 'u1', name: 'John', lastName: 'Doe', email: 'j@x.com', password: 'x', role: 'user' as const }

  beforeEach(() => {
    useAuthMock.mockReturnValue({
      user: mockUser,
      login: vi.fn(),
      logout: vi.fn(),
      isAdmin: vi.fn(() => false),
      isLoading: false,
    } as ReturnType<typeof useAuth>)
    getUserTicketsMock.mockResolvedValue([])
  })

  it('shows loading then welcome and empty state when no tickets', async () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    )
    expect(screen.getByText('Loading...')).toBeInTheDocument()
    await waitFor(() => {
      expect(screen.getByText(/Dobro dosli, John Doe!/i)).toBeInTheDocument()
    })
    expect(screen.getByText('Sazetak')).toBeInTheDocument()
    expect(screen.getByText('Nemate tiketa')).toBeInTheDocument()
  })

  it('shows ticket counts and last 3 tickets when data exists', async () => {
    getUserTicketsMock.mockResolvedValue([
      { id: 't1', userId: 'u1', title: 'T1', description: 'D1', status: 'open', createdAt: '2024-01-02', categoryId: '' },
      { id: 't2', userId: 'u1', title: 'T2', description: 'D2', status: 'in_progress', createdAt: '2024-01-01', categoryId: '' },
    ])

    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    )
    await waitFor(() => expect(screen.getByText('T1')).toBeInTheDocument())
    expect(screen.getByText('T2')).toBeInTheDocument()
    expect(screen.getAllByText('Open').length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByText('In progress').length).toBeGreaterThanOrEqual(1)
  })
})
