//jedno mesto za glavni URL

//centralna funkcija za slanje http zahteva

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export async function apiRequest<T>(
    endpoint: string, // /tickets, /users...
    options?: RequestInit 
    //ugradjeni typescript tip za fetch opcije
    //tu ide metod, body, headers
    // ?-parametar je opcion, za GET ne mora nista da se prosledi
): Promise <T> {
    //koristimo generike, jer mozemo ocekivati razlicite tipove podataka
    //ti tipovi mogu biti: niz objekata (Ticket[], User[]...), jedan objekat (Ticket, User...), prazan odgovor (void = DELETE)
    const response = await fetch(`${BASE_URL}${endpoint}`, {
        //fetch podrazumeva GET
        ...options,//siri sve opcije koje smo prosledili
        headers: {
            'Content-Type': 'application/json',
            ...options?.headers,
        },
    } );

    //response.ok je true za status kodove 200-299
    if (!response.ok) {
        let errorMessage = `API Error: ${response.status} ${response.statusText}`;

        try {
            const errorData = await response.json();
            if (errorData?.detail) {
                errorMessage = Array.isArray(errorData.detail) ? JSON.stringify(errorData.detail) : errorData.detail;
            }
        } catch {
            //ignore errors
        }

        throw new Error(errorMessage);
    }

    if (response.status === 204) {
        return undefined as T;
    }

    return response.json() as Promise<T>;
}