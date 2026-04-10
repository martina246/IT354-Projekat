import { apiRequest } from "./http";
import type { Category } from '../types/Category';

export async function getAllCategories(): Promise<Category[]> {
    return apiRequest<Category[]>('/categories');
}

export async function getCategoryById(categoryId: string): Promise <Category> {
    return apiRequest<Category>(`/categories/${categoryId}`);
}

export async function createCategory(categoryData: {
    name: string;
    description?: string;
}): Promise<Category> {
    return apiRequest<Category>('/categories', {
        method: 'POST',
        body: JSON.stringify(categoryData),
    });
}

export async function updateCategory(
    categoryId: string,
    updates: {
        name?: string;
        description?: string;
    }
): Promise<Category> {
    return apiRequest<Category>(`/categories/${categoryId}`, {
        method: 'PATCH',
        body: JSON.stringify(updates),
    });
}

export async function deleteCategory(categoryId: string): Promise<void> {
    return apiRequest<void>(`/categories/${categoryId}`, {
        method: 'DELETE',
    });
}