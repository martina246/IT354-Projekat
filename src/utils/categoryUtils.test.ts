import { describe, it, expect } from 'vitest'
import { getCategoryName } from './categoryUtils'
import type { Category } from '../types/Category'

describe('getCategoryName', () => {
  const categories: Category[] = [
    { id: '1', name: 'Bug', description: 'Bug reports', createdAt: '2024-01-01' },
    { id: '2', name: 'Feature', description: 'Feature requests', createdAt: '2024-01-01' },
  ]

  it('returns "No Category" when categoryId is empty', () => {
    expect(getCategoryName('', categories)).toBe('No Category')
  })

  it('returns "Unknown Category" when category is not found', () => {
    expect(getCategoryName('nonexistent', categories)).toBe('Unknown Category')
  })

  it('returns the category name when found', () => {
    expect(getCategoryName('1', categories)).toBe('Bug')
    expect(getCategoryName('2', categories)).toBe('Feature')
  })

  it('returns "Unknown Category" when categories array is empty', () => {
    expect(getCategoryName('1', [])).toBe('Unknown Category')
  })
})
