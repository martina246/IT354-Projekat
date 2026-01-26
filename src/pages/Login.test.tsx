import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import Login from './Login'

const mockNavigate = vi.hoisted(() => vi.fn())
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom')
  return { ...actual, useNavigate: () => mockNavigate }
})

vi.mock('../api/auth.api', () => ({ getAllUsers: vi.fn() }))
vi.mock('../context/AuthContext', () => ({ useAuth: vi.fn() }))

import { getAllUsers } from '../api/auth.api'
import { useAuth } from '../context/AuthContext'

const getAllUsersMock = vi.mocked(getAllUsers)
const useAuthMock = vi.mocked(useAuth)

const mockUser = {
  id: '1',
  name: 'John',
  lastName: 'Doe',
  email: 'john@example.com',
  password: 'pass123',
  role: 'user' as const,
}

describe('Login', () => {
  beforeEach(() => {
    mockNavigate.mockClear()
    useAuthMock.mockReturnValue({
      user: null,
      login: vi.fn(),
      logout: vi.fn(),
      isAdmin: vi.fn(() => false),
      isLoading: false,
    } as ReturnType<typeof useAuth>)
  })

  it('renders form with email and password', () => {
    getAllUsersMock.mockResolvedValue([])
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    )
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Log In/i })).toBeInTheDocument()
  })

  it('on success calls login and navigate to /home', async () => {
    const login = vi.fn()
    useAuthMock.mockReturnValue({
      user: null,
      login,
      logout: vi.fn(),
      isAdmin: vi.fn(() => false),
      isLoading: false,
    } as ReturnType<typeof useAuth>)
    getAllUsersMock.mockResolvedValue([mockUser])

    const user = userEvent.setup()
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    )
    await user.type(screen.getByLabelText(/Email/i), 'john@example.com')
    await user.type(screen.getByLabelText(/Password/i), 'pass123')
    await user.click(screen.getByRole('button', { name: /Log In/i }))

    await waitFor(() => {
      expect(login).toHaveBeenCalledWith(mockUser)
      expect(mockNavigate).toHaveBeenCalledWith('/home')
    })
  })

  it('shows alert when user does not exist', async () => {
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {})
    getAllUsersMock.mockResolvedValue([])

    const user = userEvent.setup()
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    )
    await user.type(screen.getByLabelText(/Email/i), 'nonexistent@example.com')
    await user.type(screen.getByLabelText(/Password/i), 'any')
    await user.click(screen.getByRole('button', { name: /Log In/i }))

    await waitFor(() => expect(alertSpy).toHaveBeenCalledWith('User does not exist'))
    expect(mockNavigate).not.toHaveBeenCalled()
    alertSpy.mockRestore()
  })

  it('shows alert when password is wrong', async () => {
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {})
    getAllUsersMock.mockResolvedValue([mockUser])

    const user = userEvent.setup()
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    )
    await user.type(screen.getByLabelText(/Email/i), 'john@example.com')
    await user.type(screen.getByLabelText(/Password/i), 'wrongpassword')
    await user.click(screen.getByRole('button', { name: /Log In/i }))

    await waitFor(() => expect(alertSpy).toHaveBeenCalledWith('Invalid password'))
    expect(mockNavigate).not.toHaveBeenCalled()
    alertSpy.mockRestore()
  })
})
