import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { ProtectedRoute } from './ProtectedRoute'
import { useAuth } from '../context/AuthContext'

vi.mock('../context/AuthContext', async () => {
  const actual = await vi.importActual<typeof import('../context/AuthContext')>('../context/AuthContext')
  return {
    ...actual,
    useAuth: vi.fn(),
  }
})

const useAuthMock = vi.mocked(useAuth)

function TestRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<div>Login Page</div>} />
      <Route
        path="/protected"
        element={
          <ProtectedRoute>
            <div>Protected Content</div>
          </ProtectedRoute>
        }
      />
    </Routes>
  )
}

describe('ProtectedRoute', () => {
  it('shows Loading when isLoading is true', () => {
    useAuthMock.mockReturnValue({
      user: null,
      login: vi.fn(),
      logout: vi.fn(),
      isAdmin: vi.fn(() => false),
      isLoading: true,
    } as ReturnType<typeof useAuth>)

    render(
      <MemoryRouter initialEntries={['/protected']}>
        <TestRoutes />
      </MemoryRouter>
    )
    expect(screen.getByText('Loading...')).toBeInTheDocument()
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument()
  })

  it('redirects to /login when user is null and not loading', () => {
    useAuthMock.mockReturnValue({
      user: null,
      login: vi.fn(),
      logout: vi.fn(),
      isAdmin: vi.fn(() => false),
      isLoading: false,
    } as ReturnType<typeof useAuth>)

    render(
      <MemoryRouter initialEntries={['/protected']}>
        <TestRoutes />
      </MemoryRouter>
    )
    expect(screen.getByText('Login Page')).toBeInTheDocument()
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument()
  })

  it('renders children when user is present', () => {
    useAuthMock.mockReturnValue({
      user: { id: '1', name: 'A', lastName: 'B', email: 'a@b.com', password: 'x', role: 'user' },
      login: vi.fn(),
      logout: vi.fn(),
      isAdmin: vi.fn(() => false),
      isLoading: false,
    } as ReturnType<typeof useAuth>)

    render(
      <MemoryRouter initialEntries={['/protected']}>
        <TestRoutes />
      </MemoryRouter>
    )
    expect(screen.getByText('Protected Content')).toBeInTheDocument()
  })
})
