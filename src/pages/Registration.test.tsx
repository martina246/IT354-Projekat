import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import Registration from './Registration'

const mockNavigate = vi.hoisted(() => vi.fn())
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom')
  return { ...actual, useNavigate: () => mockNavigate }
})

vi.mock('../api/auth.api', () => ({ registerUser: vi.fn() }))

import { registerUser } from '../api/auth.api'

const registerUserMock = vi.mocked(registerUser)

describe('Registration', () => {
  beforeEach(() => {
    mockNavigate.mockClear()
    registerUserMock.mockResolvedValue({
      id: '1',
      name: 'Jane',
      lastName: 'Doe',
      email: 'jane@example.com',
      password: 'secret',
    })
  })

  it('renders form with all fields', () => {
    render(
      <MemoryRouter>
        <Registration />
      </MemoryRouter>
    )
    expect(screen.getByPlaceholderText('Your name')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Your last name')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('you@example.com')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Create a password')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Register/i })).toBeInTheDocument()
  })

  it('on submit calls registerUser and navigates to /login', async () => {
    const user = userEvent.setup()
    render(
      <MemoryRouter>
        <Registration />
      </MemoryRouter>
    )
    await user.type(screen.getByLabelText(/^Name/i), 'Jane')
    await user.type(screen.getByLabelText(/Last Name/i), 'Doe')
    await user.type(screen.getByLabelText(/Email/i), 'jane@example.com')
    await user.type(screen.getByLabelText(/Password/i), 'secret')
    await user.click(screen.getByRole('button', { name: /Register/i }))

    await waitFor(() => {
      expect(registerUserMock).toHaveBeenCalledWith({
        name: 'Jane',
        lastName: 'Doe',
        email: 'jane@example.com',
        password: 'secret',
      })
      expect(mockNavigate).toHaveBeenCalledWith('/login')
    })
  })
})
