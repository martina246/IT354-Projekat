import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Home.css";
import OpenTicketModal from "../components/OpenTicketModal";
import type { Ticket } from '../types/Ticket';
import type { User } from '../types/User';
import { getUserTickets } from "../api/tickets.api";



function Home() {
    const navigate = useNavigate();
    const [user, setUser] = useState<User | null>(null);
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [loading, setLoading] = useState(true);
    
    // Modal state for opening tickets
    const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
    const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);

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
            const userTickets = await getUserTickets(userId);
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

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'open': return 'Open';
            case 'in_progress': return 'In progress';
            case 'closed': return 'Closed';
            default: return status;
        }
    }

    const handleTicketClick = (ticket: Ticket) => {
        setSelectedTicket(ticket);
        setIsTicketModalOpen(true);
    };

    const handleTicketUpdated = () => {
        // Refresh tickets after update
        if (user) {
            fetchTickets(user.id);
        }
    };

    // Convert Home Ticket to OpenTicketModal Ticket format (id: number -> string)
    const convertTicketForModal = (ticket: Ticket | null) => {
        if (!ticket) return null;
        return {
            ...ticket,
            id: String(ticket.id)
        };
    };

    if (loading) {
        return <div className="home-loading">Loading...</div>;
    }

    if (!user) {
        return null;
    }



    return (
        <div className="home-container">
            {/* sidebar */}
            <aside className="home-sidebar">
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

            {/* main */}
            <main className="home-main">
                <h1 className="home-welcome">Dobro dosli, {user.name} {user.lastName}!</h1>

                

                {/* summary */}
                <div className="home-summary">
                    <h2>Sazetak</h2>
                    <div className="home-summary-grid">
                        <div className="home-summary-card open">
                            <h3>Open</h3>
                            <p className="home-summary-count">{openCount}</p>
                        </div>
                        <div className="home-summary-card in-progress">
                            <h3>In progress</h3>
                            <p className="home-summary-count">{inProgressCount}</p>
                        </div>
                        <div className="home-summary-card closed">
                            <h3>Closed</h3>
                            <p className="home-summary-count">{closedCount}</p>
                        </div>
                    </div>
                </div>

                {/* poslednja 3 tiketa */}
                <div className="home-last-tickets">
                    <h2>Poslednja 3 tiketa</h2>
                    {lastThreeTickets.length === 0 ? (
                        <p className="home-empty-message">Nemate tiketa</p>
                    ) : (
                        <div className="home-tickets-list">
                            {lastThreeTickets.map((ticket) => (
                                <div onClick={() => handleTicketClick(ticket)}
                                    key={ticket.id} 
                                    className={`home-ticket-card ${ticket.status === 'in_progress' ? 'in-progress' : ticket.status}`}
                                >
                                    <div className="home-ticket-content">
                                        <div className="home-ticket-info">
                                            <h3>{ticket.title}</h3>
                                            <p>{ticket.description}</p>
                                            <small>
                                                {new Date(ticket.createdAt).toLocaleDateString('sr-RS')}
                                            </small>
                                        </div>
                                        <span className={`home-ticket-status ${ticket.status === 'in_progress' ? 'in-progress' : ticket.status}`}>
                                            {getStatusLabel(ticket.status)}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Ticket Modal */}
                <OpenTicketModal
                    isOpen={isTicketModalOpen}
                    onClose={() => {
                        setIsTicketModalOpen(false);
                        setSelectedTicket(null);
                    }}
                    ticket={convertTicketForModal(selectedTicket)}
                    onTicketUpdated={handleTicketUpdated}
                />
            </main>
        </div>
    )

}

export default Home;