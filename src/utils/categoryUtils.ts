import type { Category } from '../types/Category';

export function getCategoryName(categoryId: string, categories: Category[]): string {
    if (!categoryId) return 'No Category';
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : 'Unknown Category';
}
