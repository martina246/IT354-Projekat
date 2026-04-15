import { apiRequest } from "./http";
import type { User } from '../types/User';

//Separation of Concerns (SoC) is a core software design principle where a system is divided into distinct, overlapping sections, 
//each handling a specific "concern" (functionality or responsibility) like data, logic, or presentation, to reduce complexity, improve modularity, 
// and make code easier to maintain, understand, and update. Think of it like organizing a library: books (data) aren't mixed with the librarian's tasks (logic) or the building's decor (style)

export async function loginUser(credentials: {
    email: string;
    password: string;
}) : Promise<User> {
    return apiRequest<User>('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
    });
}


//registrovanje novog korisnika
//CREATE
export async function registerUser(userData: {
    name: string;
    lastName: string;
    email: string;
    password: string;
}): Promise<User> {
    return apiRequest<User>('/users', {
        method: 'POST',
        body: JSON.stringify(userData),
    });
}