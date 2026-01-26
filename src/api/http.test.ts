import { describe, it, expect, beforeEach, vi } from 'vitest'
import { apiRequest } from './http'

describe('apiRequest', () => {
  const mockFetch = vi.fn()
  beforeEach(() => {
    vi.stubGlobal('fetch', mockFetch)
  })

  it('sends GET request to correct URL with JSON headers', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ data: 'test' }),
    } as Response)

    const result = await apiRequest<{ data: string }>('/users')

    expect(mockFetch).toHaveBeenCalledWith(
      'http://localhost:3001/users',
      expect.objectContaining({
        headers: expect.objectContaining({
          'Content-Type': 'application/json',
        }),
      })
    )
    expect(result).toEqual({ data: 'test' })
  })

  it('sends POST with body when options provided', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ id: '1' }),
    } as Response)

    await apiRequest('/users', {
      method: 'POST',
      body: JSON.stringify({ name: 'John' }),
    })

    expect(mockFetch).toHaveBeenCalledWith(
      'http://localhost:3001/users',
      expect.objectContaining({
        method: 'POST',
        body: '{"name":"John"}',
      })
    )
  })

  it('merges custom headers with Content-Type', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({}),
    } as Response)

    await apiRequest('/users', {
      headers: { 'X-Custom': 'value' },
    })

    expect(mockFetch).toHaveBeenCalledWith(
      'http://localhost:3001/users',
      expect.objectContaining({
        headers: expect.objectContaining({
          'Content-Type': 'application/json',
          'X-Custom': 'value',
        }),
      })
    )
  })

  it('throws when response is not ok', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      statusText: 'Not Found',
    } as Response)

    await expect(apiRequest('/missing')).rejects.toThrow('API Error: Not Found')
  })
})
