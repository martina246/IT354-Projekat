import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import type { User } from '../types/User';

//manages authentication state globally so components don't check localStorage directly
//ovo omogucava da cela aplikacija zna ko je ulogovan korisnik, da li je admin, 
// kako se korisnik loguje i izloguje i da sve to prezivi refresh stranice

//ovo je ugovor konteksta
interface AuthContextType {
    user: User | null;
    login: (user: User) => void;
    logout: () => void;
    isAdmin: () => boolean;
    isLoading: boolean;
}

//kreiranje konteksta bez pocetne vrednosti
const AuthContext = createContext<AuthContextType | undefined>(undefined);

//ovo je komponenta koja obavija aplikaciju
//children su sve komponente unutar nje: App, rute, stranice...
export function AuthProvider({ children }: { children: ReactNode }) {
    //ovo se pokrece pri pokretanju aplikacije, jednom
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    //if+return prekida render akciju
    //koristimo uslovno rednerovanje sa return , koje prekida izvrsavanje render funkcije i prikazuje
    //samo loading komponentu

    useEffect(() => {
        const loggedInUser = localStorage.getItem('loggedInUser');
        if (loggedInUser) {
            try {
                setUser(JSON.parse(loggedInUser));
            } catch (error) {
                console.error('Error parsing user from localStorager:', error);
                localStorage.removeItem('loggedInUser');
            }
        }
        setIsLoading(false);
    }, []);

    const login = (userData: User) => {
        setUser(userData); //postavlja korisnika u react state
        localStorage.setItem('loggedInUser', JSON.stringify(userData)); //cuva ga u ls
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('loggedInUser');
    };

    const isAdmin = () => {
        return user?.role === 'admin';
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, isAdmin, isLoading}}>
            {children}
        </AuthContext.Provider>
    );
}

//custom hook
export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    } 
    return context;
}