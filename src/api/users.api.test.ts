import { describe, it, expect, beforeEach, vi } from 'vitest'
import { getAllUsers, getUserById, getTicketsByUser } from './users.api'

const mockFetch = vi.fn()

describe('users.api', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', mockFetch)
  })

  it('getAllUsers fetches /users', async () => {
    const list = [{ id: '1', email: 'a@b.com', name: 'A', lastName: 'B', role: 'user', password: 'x' }]
    mockFetch.mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(list) } as Response)

    const result = await getAllUsers()
    expect(mockFetch).toHaveBeenCalledWith('http://localhost:3001/users', expect.any(Object))
    expect(result).toEqual(list)
  })

  it('getUserById fetches /users/:id', async () => {
    const user = { id: '1', email: 'a@b.com', name: 'A', lastName: 'B', role: 'user', password: 'x' }
    mockFetch.mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(user) } as Response)

    const result = await getUserById('1')
    expect(mockFetch).toHaveBeenCalledWith('http://localhost:3001/users/1', expect.any(Object))
    expect(result).toEqual(user)
  })

  it('getTicketsByUser fetches /tickets?userId=:id', async () => {
    const tickets = [{ id: 't1', userId: '1', title: 'T', description: 'D', status: 'open', createdAt: '2024-01-01', categoryId: '' }]
    mockFetch.mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(tickets) } as Response)

    const result = await getTicketsByUser('1')
    expect(mockFetch).toHaveBeenCalledWith('http://localhost:3001/tickets?userId=1', expect.any(Object))
    expect(result).toEqual(tickets)
  })
})
