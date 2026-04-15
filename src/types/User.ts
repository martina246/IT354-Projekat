export type Role = 'user' | 'admin';

export interface User {
    id: string;
    name: string;
    lastName: string;
    email: string;
    role?: Role;
}