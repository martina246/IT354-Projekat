import { apiRequest } from "./http";
import type { User } from '../types/User';
import type { Ticket } from '../types/Ticket';

export async function getAllUsers(): Promise<User[]> {
    return apiRequest<User[]>('/users');
}

export async function getTicketsByUser(userId: string): Promise<Ticket[]> {
    return apiRequest<Ticket[]>(`/tickets?userId=${userId}`);
}