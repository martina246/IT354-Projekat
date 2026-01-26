import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import Navbar from './Navbar'

const mockNavigate = vi.hoisted(() => vi.fn())
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom')
  return { ...actual, useNavigate: () => mockNavigate }
})

vi.mock('../context/AuthContext', () => ({
  useAuth: vi.fn(),
}))

import { useAuth } from '../context/AuthContext'

const useAuthMock = vi.mocked(useAuth)

describe('Navbar', () => {
  beforeEach(() => {
    mockNavigate.mockClear()
  })

  it('renders Help Desk and user links', () => {
    useAuthMock.mockReturnValue({
      user: { id: '1', name: 'A', lastName: 'B', email: 'a@b.com', password: 'x', role: 'user' },
      login: vi.fn(),
      logout: vi.fn(),
      isAdmin: vi.fn(() => false),
      isLoading: false,
    } as ReturnType<typeof useAuth>)

    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    )
    expect(screen.getByText('Help Desk')).toBeInTheDocument()
    expect(screen.getByText('Home')).toBeInTheDocument()
    expect(screen.getByText('My Tickets')).toBeInTheDocument()
    expect(screen.queryByText('Dashboard')).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Logout/i })).toBeInTheDocument()
  })

  it('shows admin links when isAdmin is true', () => {
    useAuthMock.mockReturnValue({
      user: { id: '1', name: 'A', lastName: 'B', email: 'a@b.com', password: 'x', role: 'admin' },
      login: vi.fn(),
      logout: vi.fn(),
      isAdmin: vi.fn(() => true),
      isLoading: false,
    } as ReturnType<typeof useAuth>)

    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    )
    expect(screen.getByText('Dashboard')).toBeInTheDocument()
    expect(screen.getByText('All Tickets')).toBeInTheDocument()
    expect(screen.getByText('Categories')).toBeInTheDocument()
    expect(screen.getByText('Users')).toBeInTheDocument()
  })

  it('hides Logout when user is null', () => {
    useAuthMock.mockReturnValue({
      user: null,
      login: vi.fn(),
      logout: vi.fn(),
      isAdmin: vi.fn(() => false),
      isLoading: false,
    } as ReturnType<typeof useAuth>)

    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    )
    expect(screen.queryByRole('button', { name: /Logout/i })).not.toBeInTheDocument()
  })

  it('calls logout and navigate to / on Logout click', async () => {
    const logout = vi.fn()
    useAuthMock.mockReturnValue({
      user: { id: '1', name: 'A', lastName: 'B', email: 'a@b.com', password: 'x', role: 'user' },
      login: vi.fn(),
      logout,
      isAdmin: vi.fn(() => false),
      isLoading: false,
    } as ReturnType<typeof useAuth>)

    const user = userEvent.setup()
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    )
    await user.click(screen.getByRole('button', { name: /Logout/i }))
    expect(logout).toHaveBeenCalled()
    expect(mockNavigate).toHaveBeenCalledWith('/')
  })
})
