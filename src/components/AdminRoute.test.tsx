import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { AdminRoute } from './AdminRoute'

vi.mock('../context/AuthContext', () => ({
  useAuth: vi.fn(),
}))

vi.mock('./ProtectedRoute', () => ({
  ProtectedRoute: ({ children }: { children: React.ReactNode }) => <div data-testid="protected">{children}</div>,
}))

import { useAuth } from '../context/AuthContext'

const useAuthMock = vi.mocked(useAuth)

function TestRoutes() {
  return (
    <Routes>
      <Route path="/home" element={<div>Home Page</div>} />
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <div>Admin Dashboard</div>
          </AdminRoute>
        }
      />
    </Routes>
  )
}

describe('AdminRoute', () => {
  it('renders children when isAdmin returns true', () => {
    useAuthMock.mockReturnValue({
      user: { id: '1', name: 'A', lastName: 'B', email: 'a@b.com', password: 'x', role: 'admin' },
      login: vi.fn(),
      logout: vi.fn(),
      isAdmin: vi.fn(() => true),
      isLoading: false,
    } as ReturnType<typeof useAuth>)

    render(
      <MemoryRouter initialEntries={['/admin']}>
        <TestRoutes />
      </MemoryRouter>
    )
    expect(screen.getByText('Admin Dashboard')).toBeInTheDocument()
  })

  it('redirects to /home when isAdmin returns false', () => {
    useAuthMock.mockReturnValue({
      user: { id: '1', name: 'A', lastName: 'B', email: 'a@b.com', password: 'x', role: 'user' },
      login: vi.fn(),
      logout: vi.fn(),
      isAdmin: vi.fn(() => false),
      isLoading: false,
    } as ReturnType<typeof useAuth>)

    render(
      <MemoryRouter initialEntries={['/admin']}>
        <TestRoutes />
      </MemoryRouter>
    )
    expect(screen.getByText('Home Page')).toBeInTheDocument()
    expect(screen.queryByText('Admin Dashboard')).not.toBeInTheDocument()
  })
})
