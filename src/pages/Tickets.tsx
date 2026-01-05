import { useState, useEffect } from "react";
//useEffect se izvrsava kada se komponenta ucita ili se nesto promeni
import { useNavigate, Link } from "react-router-dom";
import CreateTicketModal from "../components/CreateTicketModal";
import OpenTicketModal from "../components/OpenTicketModal";
import "./Tickets.css";

interface Ticket {
    id: string;
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

function Tickets() {
    const navigate = useNavigate();
    const [user, setUser] = useState<User | null>(null);
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [filteredTickets, setFilteredTickets] = useState<Ticket[]>([]);
    const [loading, setLoading] = useState(true);
    //dok cekamo fetch

    const [searchQuery, setSearchQuery] = useState('');
    //tekst za pretragu
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [dateFilter, setDateFilter] = useState<string>('all');

    //modal za novi tiket
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    //modal za prikaz tiketa
    const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
    const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);

    useEffect(() => {
        const loggedInUser = localStorage.getItem('loggedInUser');
        if (!loggedInUser) {
            navigate('/login');
            return;
            //prekida dalje izvrsavanje ovog useEffect-a
        }

        const userData = JSON.parse(loggedInUser);
        setUser(userData);
        fetchTickets(userData.id);
    }, [navigate]);

    useEffect(() => {
        filterTickets();
    }, [searchQuery, statusFilter, dateFilter, tickets]);

    const fetchTickets = async (userId: string) => {
        try {
            const response = await fetch(`http://localhost:3001/tickets?userId=${userId}`);
            const userTickets = await response.json();
            const sortedTickets = userTickets.sort((a: Ticket, b: Ticket) =>
                new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            //getTime - vraca broj milisekundi od 01.01.1970.
            );
            setTickets(sortedTickets);
            setFilteredTickets(sortedTickets);
        } catch (error) {
            console.error('Error fetching tickets:', error);
        } finally {
            setLoading(false);
        }
    };

    const filterTickets = () => {
        let filtered = [...tickets];
        //pravi niz sa istim elementima kao i u tickets
        //pravimo kopiju jer ne smemo u Reactu menjati state direktno

        if (searchQuery) {
            filtered = filtered.filter(ticket =>
                ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                ticket.description.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        if (statusFilter !== 'all') {
            filtered = filtered.filter(ticket => ticket.status === statusFilter);
        }

        //guard uslov
        if (dateFilter !== 'all') {
            const now = new Date();
            filtered = filtered.filter(ticket => {
                const ticketDate = new Date(ticket.createdAt);
                switch (dateFilter) {
                    case 'today':
                        return ticketDate.toDateString() === now.toDateString();
                        //vraca samo datum, bez vremena
                    case 'week':
                        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                        //trenutak u milisekundama - 7 dana u milisekundama
                        return ticketDate >= weekAgo;
                    case 'month':
                        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
                        return ticketDate >= monthAgo;
                    default:
                        return true;
                }
            });
        }

        setFilteredTickets(filtered);
    };


    const getTicketsByStatus = (status: 'open' | 'in_progress' | 'closed') => {
        return filteredTickets.filter(ticket => ticket.status === status);
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!user) {
        return null;
    }

    const openTickets = getTicketsByStatus('open');
    const inProgressTickets = getTicketsByStatus('in_progress');
    const closedTickets = getTicketsByStatus('closed');

    const handleTicketCreated = () => {
        // osvezavanje liste tiketa
        if (user) {
            fetchTickets(user.id);
        }
    };

    const handleTicketClick = (ticket: Ticket) => {
        setSelectedTicket(ticket);
        setIsTicketModalOpen(true);
    };

    const handleTicketUpdated = () => {
        // osvezavanje liste tiketa nakon update-a
        if (user) {
            fetchTickets(user.id);
        }
    };


    return (
        <div className="tickets-container">
            {/* sidebar */}
            <aside className="tickets-sidebar">
                <nav>
                    <h2>Help Desk</h2>
                    <ul>
                        <li>
                            <Link to="/home">
                                Home
                            </Link>
                        </li>
                        <li>
                            <Link to="/tickets">
                                My tickets
                            </Link>
                        </li>
                    </ul>
                </nav>
            </aside>

            {/* main*/}
            <main className="tickets-main">
                <h1 className="tickets-title">My Tickets</h1>

                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="tickets-create-button"
                >
                    Create New Ticket
                </button>

                <CreateTicketModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onTicketCreated={handleTicketCreated}
                />

                <OpenTicketModal
                    isOpen={isTicketModalOpen}
                    onClose={() => {
                        setIsTicketModalOpen(false);
                        setSelectedTicket(null);
                    }}
                    ticket={selectedTicket}
                    onTicketUpdated={handleTicketUpdated}
                />

                {/* pretraga i filteri */}
                <div className="tickets-filters">
                    {/* search bar */}
                    <input
                        type="text"
                        placeholder="Search tickets..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="tickets-search-input"
                    />

                    {/* status filter */}
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="tickets-filter-select"
                    >
                        <option value="all">All Status</option>
                        <option value="open">Open</option>
                        <option value="in_progress">In Progress</option>
                        <option value="closed">Closed</option>
                    </select>

                    {/* date filter*/}
                    <select
                        value={dateFilter}
                        onChange={(e) => setDateFilter(e.target.value)}
                        className="tickets-filter-select"
                    >
                        <option value="all">All Time</option>
                        <option value="today">Today</option>
                        <option value="week">This Week</option>
                        <option value="month">This Month</option>
                    </select>
                </div>

                {/* kanban */}
                <div className="tickets-kanban">
                    {/* open kolona */}
                    <div className="tickets-column">
                        <div className="tickets-column-header open">
                            <h2>Open</h2>
                            <span className="tickets-count-badge open">
                                {openTickets.length}
                            </span>
                        </div>
                        <div className="tickets-column-content">
                            {openTickets.map((ticket) => (
                                <div
                                    key={ticket.id}
                                    className="tickets-card open"
                                    onClick={() => handleTicketClick(ticket)}
                                >
                                    <h3 className="tickets-card-title">
                                        {ticket.title}
                                    </h3>
                                    <p className="tickets-card-description">
                                        {ticket.description}
                                    </p>
                                    <small className="tickets-card-date">
                                        {new Date(ticket.createdAt).toLocaleDateString('sr-RS')}
                                    </small>
                                </div>
                            ))}
                            {openTickets.length === 0 && (
                                <div className="tickets-empty">
                                    No open tickets
                                </div>
                            )}
                        </div>
                    </div>

                    {/* in progress kolona */}
                    <div className="tickets-column">
                        <div className="tickets-column-header in-progress">
                            <h2>In Progress</h2>
                            <span className="tickets-count-badge in-progress">
                                {inProgressTickets.length}
                            </span>
                        </div>
                        <div className="tickets-column-content">
                            {inProgressTickets.map((ticket) => (
                                <div
                                    key={ticket.id}
                                    className="tickets-card in-progress"
                                    onClick={() => handleTicketClick(ticket)}
                                >
                                    <h3 className="tickets-card-title">
                                        {ticket.title}
                                    </h3>
                                    <p className="tickets-card-description">
                                        {ticket.description}
                                    </p>
                                    <small className="tickets-card-date">
                                        {new Date(ticket.createdAt).toLocaleDateString('sr-RS')}
                                    </small>
                                </div>
                            ))}
                            {inProgressTickets.length === 0 && (
                                <div className="tickets-empty">
                                    No in progress tickets
                                </div>
                            )}
                        </div>
                    </div>

                    {/* closed kolona */}
                    <div className="tickets-column">
                        <div className="tickets-column-header closed">
                            <h2>Closed</h2>
                            <span className="tickets-count-badge closed">
                                {closedTickets.length}
                            </span>
                        </div>
                        <div className="tickets-column-content">
                            {closedTickets.map((ticket) => (
                                <div
                                    key={ticket.id}
                                    className="tickets-card closed"
                                    onClick={() => handleTicketClick(ticket)}
                                >
                                    <h3 className="tickets-card-title">
                                        {ticket.title}
                                    </h3>
                                    <p className="tickets-card-description">
                                        {ticket.description}
                                    </p>
                                    <small className="tickets-card-date">
                                        {new Date(ticket.createdAt).toLocaleDateString('sr-RS')}
                                    </small>
                                </div>
                            ))}
                            {closedTickets.length === 0 && (
                                <div className="tickets-empty">
                                    No closed tickets
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default Tickets;