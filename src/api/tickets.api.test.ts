import { describe, it, expect, beforeEach, vi } from 'vitest'
import {
  getUserTickets,
  getAllTickets,
  createTicket,
  updateTicketStatus,
  updateTicket,
  deleteTicket,
} from './tickets.api'

const mockFetch = vi.fn()

vi.mock('./users.api', () => ({
  getUserById: vi.fn(() =>
    Promise.resolve({
      id: 'u1',
      email: 'u@x.com',
      name: 'User',
      lastName: 'One',
      role: 'user',
      password: 'x',
    })
  ),
}))

vi.mock('./email.api', () => ({
  sendTicketCreatedEmail: vi.fn(() => Promise.resolve()),
  sendTicketStatusUpdateEmail: vi.fn(() => Promise.resolve()),
}))

describe('tickets.api', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', mockFetch)
  })

  it('getUserTickets fetches /tickets?userId=:id', async () => {
    const list = [{ id: 't1', userId: 'u1', title: 'T', description: 'D', status: 'open', createdAt: '2024-01-01', categoryId: '' }]
    mockFetch.mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(list) } as Response)

    const result = await getUserTickets('u1')
    expect(mockFetch).toHaveBeenCalledWith('http://localhost:3001/tickets?userId=u1', expect.any(Object))
    expect(result).toEqual(list)
  })

  it('getAllTickets fetches /tickets', async () => {
    const list: never[] = []
    mockFetch.mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(list) } as Response)

    await getAllTickets()
    expect(mockFetch).toHaveBeenCalledWith('http://localhost:3001/tickets', expect.any(Object))
  })

  it('createTicket POSTs to /tickets with status and createdAt', async () => {
    const created = {
      id: 't1',
      userId: 'u1',
      title: 'New',
      description: 'Desc',
      status: 'open',
      createdAt: '2024-01-01',
      categoryId: '',
    }
    mockFetch.mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(created) } as Response)

    const result = await createTicket({
      userId: 'u1',
      title: 'New',
      description: 'Desc',
      status: 'open',
      categoryId: 'c1',
    })

    expect(mockFetch).toHaveBeenCalledWith(
      'http://localhost:3001/tickets',
      expect.objectContaining({
        method: 'POST',
        body: expect.stringContaining('"title":"New"'),
      })
    )
    const body = JSON.parse(mockFetch.mock.calls[0][1].body)
    expect(body.status).toBe('open')
    expect(body.categoryId).toBe('c1')
    expect(body.createdAt).toBeDefined()
    expect(result).toEqual(created)
  })

  it('createTicket uses empty categoryId when not provided', async () => {
    const created = { id: 't1', userId: 'u1', title: 'T', description: 'D', status: 'open', createdAt: '2024-01-01', categoryId: '' }
    mockFetch.mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(created) } as Response)

    await createTicket({ userId: 'u1', title: 'T', description: 'D', status: 'open' })

    const body = JSON.parse(mockFetch.mock.calls[0][1].body)
    expect(body.categoryId).toBe('')
  })

  it('updateTicketStatus PATCHes /tickets/:id with status', async () => {
    const updated = { id: 't1', userId: 'u1', title: 'T', description: 'D', status: 'closed', createdAt: '2024-01-01', categoryId: '' }
    mockFetch
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({ ...updated, status: 'open' }) } as Response)
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(updated) } as Response)

    const result = await updateTicketStatus('t1', 'closed')

    expect(mockFetch).toHaveBeenCalledWith('http://localhost:3001/tickets/t1', expect.any(Object))
    expect(mockFetch).toHaveBeenLastCalledWith(
      'http://localhost:3001/tickets/t1',
      expect.objectContaining({ method: 'PATCH', body: '{"status":"closed"}' })
    )
    expect(result).toEqual(updated)
  })

  it('updateTicket PATCHes /tickets/:id with updates', async () => {
    const updated = { id: 't1', userId: 'u1', title: 'New Title', description: 'New Desc', status: 'open', createdAt: '2024-01-01', categoryId: '' }
    mockFetch.mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(updated) } as Response)

    const result = await updateTicket('t1', { title: 'New Title', description: 'New Desc' })

    expect(mockFetch).toHaveBeenCalledWith(
      'http://localhost:3001/tickets/t1',
      expect.objectContaining({
        method: 'PATCH',
        body: '{"title":"New Title","description":"New Desc"}',
      })
    )
    expect(result).toEqual(updated)
  })

  it('deleteTicket DELETEs /tickets/:id', async () => {
    mockFetch.mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(undefined) } as Response)

    await deleteTicket('t1')

    expect(mockFetch).toHaveBeenCalledWith(
      'http://localhost:3001/tickets/t1',
      expect.objectContaining({ method: 'DELETE' })
    )
  })
})
