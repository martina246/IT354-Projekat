import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { AuthProvider } from '../context/AuthContext'
import AuthChoice from './AuthChoice'
import Login from './Login'
import Registration from './Registration'

function renderWithAuth(ui: React.ReactElement, initialEntries = ['/']) {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <AuthProvider>
        {ui}
      </AuthProvider>
    </MemoryRouter>
  )
}

describe('AuthChoice', () => {
  beforeEach(() => localStorage.clear())

  it('renders Help Desk and Log In / Sign Up buttons', () => {
    renderWithAuth(
      <Routes>
        <Route path="/" element={<AuthChoice />} />
      </Routes>
    )
    expect(screen.getByText('Help Desk')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Log In/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Sign Up/i })).toBeInTheDocument()
  })

  it('navigates to /login when Log In is clicked', async () => {
    const user = userEvent.setup()
    renderWithAuth(
      <Routes>
        <Route path="/" element={<AuthChoice />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    )
    await user.click(screen.getByRole('button', { name: /Log In/i }))
    expect(screen.getByRole('heading', { name: /Log In/i })).toBeInTheDocument()
  })

  it('navigates to /registration when Sign Up is clicked', async () => {
    const user = userEvent.setup()
    renderWithAuth(
      <Routes>
        <Route path="/" element={<AuthChoice />} />
        <Route path="/registration" element={<Registration />} />
      </Routes>
    )
    await user.click(screen.getByRole('button', { name: /Sign Up/i }))
    expect(screen.getByRole('heading', { name: /Create Account/i })).toBeInTheDocument()
  })
})
