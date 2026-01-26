import { describe, it, expect, beforeEach, vi } from 'vitest'
import {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} from './categories.api'

const mockFetch = vi.fn()

describe('categories.api', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', mockFetch)
  })

  it('getAllCategories fetches /categories', async () => {
    const list = [{ id: '1', name: 'Bug', description: 'x', createdAt: '2024-01-01' }]
    mockFetch.mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(list) } as Response)

    const result = await getAllCategories()
    expect(mockFetch).toHaveBeenCalledWith('http://localhost:3001/categories', expect.any(Object))
    expect(result).toEqual(list)
  })

  it('getCategoryById fetches /categories/:id', async () => {
    const cat = { id: '1', name: 'Bug', description: 'x', createdAt: '2024-01-01' }
    mockFetch.mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(cat) } as Response)

    const result = await getCategoryById('1')
    expect(mockFetch).toHaveBeenCalledWith('http://localhost:3001/categories/1', expect.any(Object))
    expect(result).toEqual(cat)
  })

  it('createCategory POSTs to /categories', async () => {
    const data = { name: 'Feature', description: 'y' }
    const created = { id: '2', ...data, createdAt: '2024-01-02' }
    mockFetch.mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(created) } as Response)

    const result = await createCategory(data)
    expect(mockFetch).toHaveBeenCalledWith(
      'http://localhost:3001/categories',
      expect.objectContaining({
        method: 'POST',
        body: expect.stringContaining('"name":"Feature"'),
      })
    )
    expect(result).toEqual(created)
  })

  it('updateCategory PATCHes /categories/:id', async () => {
    const updated = { id: '1', name: 'Bug Fixed', description: 'z', createdAt: '2024-01-01' }
    mockFetch.mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(updated) } as Response)

    const result = await updateCategory('1', { name: 'Bug Fixed' })
    expect(mockFetch).toHaveBeenCalledWith(
      'http://localhost:3001/categories/1',
      expect.objectContaining({ method: 'PATCH', body: '{"name":"Bug Fixed"}' })
    )
    expect(result).toEqual(updated)
  })

  it('deleteCategory DELETEs /categories/:id', async () => {
    mockFetch.mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(undefined) } as Response)

    await deleteCategory('1')
    expect(mockFetch).toHaveBeenCalledWith(
      'http://localhost:3001/categories/1',
      expect.objectContaining({ method: 'DELETE' })
    )
  })
})
