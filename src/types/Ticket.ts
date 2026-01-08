export interface Ticket {
    id: string;
    userId: string;
    title: string;
    description: string;
    status: 'open' | 'in_progress' | 'closed';
    createdAt: string;
    categoryId: string;
}