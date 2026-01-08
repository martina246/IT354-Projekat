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
}): Promise<Ticket> {
    return apiRequest<Ticket>('/tickets', {
        method: 'POST',
        body: JSON.stringify({
            ...ticketData,
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


export async function deleteTicket(ticketId: string): Promise<void> {
    return apiRequest<void>(`/tickets/${ticketId}`, {
        method: 'DELETE',
    });
}
