//sve operacije sa tiketima

import { apiRequest } from './http';
import type { Ticket } from '../types/Ticket';
import { getUserById } from './users.api';
import { sendTicketCreatedEmail, sendTicketStatusUpdateEmail } from './email.api';

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
        const newTicket = await apiRequest<Ticket>('/tickets', {
            method: 'POST',
            body: JSON.stringify({
                ...ticketData,
                categoryId: ticketData.categoryId || '',
                createdAt: new Date().toISOString(),
            }),
    });

    try {
        const user = await getUserById(ticketData.userId);
        await sendTicketCreatedEmail(
            user.email,
            `${user.name} ${user.lastName}`,
            newTicket.title,
            newTicket.id
        );
    } catch (error) {
        console.error('Failed to send ticket creation email:', error);
    }

    return newTicket;
}



export async function updateTicketStatus(
    ticketId: string,
    status: 'open' | 'in_progress' | 'closed'
): Promise<Ticket> {
    const currentTicket = await apiRequest<Ticket>(`/tickets/${ticketId}`);
    const oldStatus = currentTicket.status;

    const updatedTicket = await apiRequest<Ticket>(`/tickets/${ticketId}`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
    });

    if (oldStatus !== status) {
        try {
            const user = await getUserById(updatedTicket.userId);
            await sendTicketStatusUpdateEmail(
                user.email,
                `${user.name} ${user.lastName}`,
                updatedTicket.title,
                updatedTicket.id,
                oldStatus,
                status
            );
        } catch (error) {
            console.error('Failed to send status update email:', error);
        }
    }

    return updatedTicket;
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
    let oldStatus: string | undefined;
    if (updates.status) {
        const currentTicket = await apiRequest<Ticket>(`/tickets/${ticketId}`);
        oldStatus = currentTicket.status;
    }

    const updatedTicket = await apiRequest<Ticket>(`/tickets/${ticketId}`, {
        method: 'PATCH',
        body: JSON.stringify(updates),
    });

    if (updates.status && oldStatus && oldStatus !== updates.status) {
        try {
            const user = await getUserById(updatedTicket.userId);
            await sendTicketStatusUpdateEmail(
                user.email,
                `${user.name} ${user.lastName}`,
                updatedTicket.title,
                updatedTicket.id,
                oldStatus,
                updates.status
            );
        } catch (error) {
            console.error('Failed to send status update email:', error);
        }
    }

    return updatedTicket;
}


export async function deleteTicket(ticketId: string): Promise<void> {
    return apiRequest<void>(`/tickets/${ticketId}`, {
        method: 'DELETE',
    });
}
