//sve operacije sa tiketima

import { apiRequest } from './http';
import type { Ticket } from '../types/Ticket';

export async function getUserTickets(userId: string): Promise<Ticket[]> {
    return apiRequest<Ticket[]>(`/tickets?userId=${userId}`);
}

export async function getAllTickets(): Promise<Ticket[]> {
    return apiRequest<Ticket[]>('/tickets');
}

export async function createTicket(ticketData: {
    userId: string;
    title: string;
    description: string;
    status: 'open' | 'in_progress' | 'closed';
    categoryId?: string;
}): Promise<Ticket> {
    return apiRequest<Ticket>('/tickets', {
        method: 'POST',
        body: JSON.stringify({
            ...ticketData,
            categoryId: ticketData.categoryId || '',
            createdAt: new Date().toISOString(),
        }),
    });
}

export async function updateTicketStatus(
    ticketId: string,
    status: 'open' | 'in_progress' | 'closed'
): Promise<Ticket> {
    return apiRequest<Ticket>(`/tickets/${ticketId}`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
    });
}

export async function updateTicket(
    ticketId: string,
    updates: {
        title?: string;
        description?: string;
        status?: 'open' | 'in_progress' | 'closed';
        categoryId?: string;
    }
): Promise<Ticket> {
    return apiRequest<Ticket>(`/tickets/${ticketId}`, {
        method: 'PATCH',
        body: JSON.stringify(updates),
    });
}


export async function deleteTicket(ticketId: string): Promise<void> {
    return apiRequest<void>(`/tickets/${ticketId}`, {
        method: 'DELETE',
    });
}
