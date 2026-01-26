import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import App from './App'

describe('App', () => {
  it('renders AuthChoice at / with Help Desk and action buttons', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    )
    expect(screen.getByText('Help Desk')).toBeInTheDocument()
    expect(screen.getByText('Log In')).toBeInTheDocument()
    expect(screen.getByText('Sign Up')).toBeInTheDocument()
  })

  it('renders Login at /login', () => {
    render(
      <MemoryRouter initialEntries={['/login']}>
        <App />
      </MemoryRouter>
    )
    expect(screen.getByRole('heading', { name: /Log In/i })).toBeInTheDocument()
    expect(screen.getByText(/Access your help desk dashboard/i)).toBeInTheDocument()
  })

  it('renders Registration at /registration', () => {
    render(
      <MemoryRouter initialEntries={['/registration']}>
        <App />
      </MemoryRouter>
    )
    expect(screen.getByRole('heading', { name: /Create Account/i })).toBeInTheDocument()
  })
})
