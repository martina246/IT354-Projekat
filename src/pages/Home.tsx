import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";


interface Ticket {
    id: number;
    userId: string;
    title: string;
    description: string;
    status: 'open' | 'in_progress' | 'closed';
    createdAt: string;
}

interface User {
    id: string;
    name: string;
    lastName: string;
    email: string;
}



function Home() {
    const navigate = useNavigate();
    const [user, setUser] = useState<User | null>(null);
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loggedInUser = localStorage.getItem('loggedInUser');
        if (!loggedInUser) {
            navigate('/login');
            return;
        }
        
        const userData = JSON.parse(loggedInUser);
        setUser(userData);
        console.log('Logged in user:', userData);
        console.log('User ID:', userData.id);

        fetchTickets(userData.id);

    }, [navigate]);

    const fetchTickets = async (userId: string) => {
        try {
            const response = await fetch(`http://localhost:3001/tickets?userId=${userId}`);
            //GET request ka json-serveru
            const userTickets = await response.json();
            console.log('Fetched tickets for userId:', userId, userTickets);

            const sortedTickets = userTickets.sort((a: Ticket, b: Ticket) =>
                new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );

            setTickets(sortedTickets);
        } catch (error) {
            console.error('Error fetching tickets: ', error);
        } finally {
            setLoading(false);
        }
    };

    const openCount = tickets.filter(t => t.status === 'open').length;
    const inProgressCount = tickets.filter(t => t.status === 'in_progress').length;
    const closedCount = tickets.filter(t => t.status === 'closed').length;

    const lastThreeTickets = tickets.slice(0, 3);
    //3 najnovija

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'open': return '#ff6b6b';
            case 'in_progress': return '#4ecdc4';
            case 'closed': return "#95e1d3";
            default: return '#ccc';
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'open': return 'Open';
            case 'in_progress': return 'In progress';
            case 'closed': return 'Closed';
            default: return status;
        }
    }

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!user) {
        return null;
    }



    return (
        <div>
            

            <div>
                <aside>
                    <nav>
                        <h2>Help Desk</h2>
                        <ul>
                            <li>
                                <Link to="/home">Home</Link>
                            </li>
                            <li>
                                <Link to="/tickets">My tickets</Link>
                            </li>
                        </ul>
                    </nav>
                </aside>
            </div>

            
            <main style={{ flex: 1, padding: '2rem' }}>
                <h1>Dobro dosli, {user.name} {user.lastName}!</h1>

                <div>
                    <h2>Brze akcije</h2>
                    <div>
                        <button onClick={() => navigate('/create-ticket')}>Kreiraj novi tiket</button>
                        <button onClick={() => navigate('/tickets')}>Moji tiketi</button>
                    </div>
                </div>

                <div>
                    <h2>Sazetak</h2>

                    <div>
                        <div>
                            <h3>Open</h3>
                            <p>{openCount}</p>
                        </div>
                    </div>

                    <div>
                        <div>
                            <h3>In progress</h3>
                            <p>{inProgressCount}</p>
                        </div>
                    </div>

                    <div>
                        <div>
                            <h3>Closed</h3>
                            <p>{closedCount}</p>
                        </div>
                    </div>

                </div>

                <div>
                    <h2>Poslednja 3 tiketa</h2>
                    {lastThreeTickets.length === 0 ? (
                        <p>Nemate tiketa</p>
                    ) : (
                        <div>
                            {lastThreeTickets.map((ticket) => (
                                <div key={ticket.id} style={{borderLeft: `4px solid ${getStatusColor(ticket.status)}`}}>
                                    <div>
                                        <div>
                                            <h3>{ticket.title}</h3>
                                            <p>
                                                {ticket.description}
                                            </p>
                                            <small>
                                                {new Date(ticket.createdAt).toLocaleDateString('sr-RS')}
                                            </small>
                                        </div>
                                        <span style={{
                                            backgroundColor: getStatusColor(ticket.status),
                                        }}>
                                            {getStatusLabel(ticket.status)}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>


        </div>
    )

}

export default Home;