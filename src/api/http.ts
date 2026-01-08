//jedno mesto za glavni URL

//centralna funkcija za slanje http zahteva

const BASE_URL = 'http://localhost:3001';

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
        throw new Error(`API Error: ${response.statusText}`);
    }

    return response.json();
}