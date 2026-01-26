import { describe, it, expect, beforeEach, vi } from 'vitest'
import { getAllUsers, registerUser } from './auth.api'

const mockFetch = vi.fn()

describe('auth.api', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', mockFetch)
  })

  describe('getAllUsers', () => {
    it('returns users from /users', async () => {
      const users = [{ id: '1', email: 'a@b.com', name: 'A', lastName: 'B', role: 'user', password: 'x' }]
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(users),
      } as Response)

      const result = await getAllUsers()

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3001/users',
        expect.any(Object)
      )
      expect(result).toEqual(users)
    })
  })

  describe('registerUser', () => {
    it('POSTs user data to /users and returns created user', async () => {
      const newUser = {
        name: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'secret',
      }
      const created = { id: '1', ...newUser, role: 'user' }
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(created),
      } as Response)

      const result = await registerUser(newUser)

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3001/users',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(newUser),
        })
      )
      expect(result).toEqual(created)
    })
  })
})
