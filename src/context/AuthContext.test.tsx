import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AuthProvider, useAuth } from './AuthContext'
import type { User } from '../types/User'

const mockUser: User = {
  id: '1',
  name: 'John',
  lastName: 'Doe',
  email: 'john@example.com',
  password: 'x',
  role: 'user',
}

const adminUser: User = { ...mockUser, id: '2', role: 'admin' }

function Consumer() {
  const { user, login, logout, isAdmin, isLoading } = useAuth()
  if (isLoading) return <div>Loading</div>
  return (
    <div>
      <span data-testid="user">{user ? user.email : 'null'}</span>
      <span data-testid="is-admin">{String(isAdmin())}</span>
      <button onClick={() => login(mockUser)}>Login</button>
      <button onClick={() => login(adminUser)}>Login Admin</button>
      <button onClick={logout}>Logout</button>
    </div>
  )
}

describe('AuthContext', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.spyOn(Storage.prototype, 'getItem')
    vi.spyOn(Storage.prototype, 'setItem')
    vi.spyOn(Storage.prototype, 'removeItem')
  })

  it('useAuth throws when used outside AuthProvider', () => {
    function BadConsumer() {
      useAuth()
      return null
    }
    expect(() => render(<BadConsumer />)).toThrow('useAuth must be used within an AuthProvider')
  })

  it('starts with user null and isLoading true, then false', async () => {
    render(
      <AuthProvider>
        <Consumer />
      </AuthProvider>
    )
    await waitFor(() => {
      expect(screen.getByTestId('user')).toHaveTextContent('null')
    })
  })

  it('login sets user and stores in localStorage', async () => {
    const user = userEvent.setup()
    render(
      <AuthProvider>
        <Consumer />
      </AuthProvider>
    )
    await waitFor(() => expect(screen.getByTestId('user')).toHaveTextContent('null'))

    await user.click(screen.getByText('Login'))
    expect(screen.getByTestId('user')).toHaveTextContent('john@example.com')
    expect(localStorage.setItem).toHaveBeenCalledWith('loggedInUser', expect.any(String))
  })

  it('logout clears user and localStorage', async () => {
    const user = userEvent.setup()
    render(
      <AuthProvider>
        <Consumer />
      </AuthProvider>
    )
    await waitFor(() => expect(screen.getByTestId('user')).toHaveTextContent('null'))
    await user.click(screen.getByText('Login'))
    expect(screen.getByTestId('user')).toHaveTextContent('john@example.com')

    await user.click(screen.getByText('Logout'))
    expect(screen.getByTestId('user')).toHaveTextContent('null')
    expect(localStorage.removeItem).toHaveBeenCalledWith('loggedInUser')
  })

  it('isAdmin returns true when user.role is admin', async () => {
    const user = userEvent.setup()
    render(
      <AuthProvider>
        <Consumer />
      </AuthProvider>
    )
    await waitFor(() => expect(screen.getByTestId('user')).toHaveTextContent('null'))
    expect(screen.getByTestId('is-admin')).toHaveTextContent('false')

    await user.click(screen.getByText('Login Admin'))
    expect(screen.getByTestId('is-admin')).toHaveTextContent('true')
  })

  it('restores user from localStorage on mount', async () => {
    localStorage.setItem('loggedInUser', JSON.stringify(mockUser))

    render(
      <AuthProvider>
        <Consumer />
      </AuthProvider>
    )
    await waitFor(() => {
      expect(screen.getByTestId('user')).toHaveTextContent('john@example.com')
    })
  })

  it('clears invalid JSON from localStorage', async () => {
    localStorage.setItem('loggedInUser', 'invalid-json')

    render(
      <AuthProvider>
        <Consumer />
      </AuthProvider>
    )
    await waitFor(() => {
      expect(screen.getByTestId('user')).toHaveTextContent('null')
    })
    expect(localStorage.removeItem).toHaveBeenCalledWith('loggedInUser')
  })
})
