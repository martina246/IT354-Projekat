import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminDashboard.css";
import Navbar from "../components/Navbar";
import StatusBadge from "../components/StatusBadge";
import type { Ticket } from '../types/Ticket';
import { getAllTickets } from "../api/tickets.api";
import { useAuth } from "../context/AuthContext";

function AdminDashboard() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAllTickets();
    }, []);

    const fetchAllTickets = async () => {
        try {
            const allTickets = await getAllTickets();
            const sortedTickets = allTickets.sort((a: Ticket, b: Ticket) => 
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

            setTickets(sortedTickets);
        } catch (error) {
            console.error('Error fetching tickets:', error);
        } finally {
            setLoading(false);
        }
    };

    //uzimamo SVE tikete ikadaa
    const openCount = tickets.filter(t => t.status === 'open').length;
    const inProgressCount = tickets.filter(t => t.status === 'in_progress').length;
    const closedCount = tickets.filter(t => t.status === 'closed').length;

    //poslednjih 5
    const latestTickets = tickets.slice(0, 5);

    if (loading) {
        return <div className="admin-dashboard-loading">Loading...</div>;
    }

    if (!user) {
        return null;
    }

    return (
        <div className="admin-dashboard-container">
            <Navbar />

            <main className="admin-dashboard-main">
                <h1 className="admin-dashboard-title">Admin Dashboard</h1>
                <p className="admin-dashboard-subtitle">Welcome, {user.name} {user.lastName}</p>

                {/*ukratko*/}
                <div className="admin-dashboard-summary">
                    <h2>Ticket Summary</h2>
                    <div className="admin-summary-grid">
                        <div className="admin-summary-card open">
                            <h3>Open</h3>
                            <p className="admin-summary-count">{openCount}</p>
                        </div>
                        <div className="admin-summary-card in-progress">
                            <h3>In Progress</h3>
                            <p className="admin-summary-count">{inProgressCount}</p>
                        </div>
                        <div className="admin-summary-card closed">
                            <h3>Closed</h3>
                            <p className="admin-summary-count">{closedCount}</p>
                        </div>
                    </div>
                </div>

                {/*poslednjih 5 tketa*/}
                <div className="admin-dashboard-latest">
                    <h2>Latest 5 Tickets</h2>
                    {latestTickets.length === 0 ? (
                        <p className="admin-empty-message">No tickets found</p>
                    ) : (
                        <div className="admin-tickets-list">
                            {latestTickets.map((ticket) => (
                                <div key={ticket.id} onClick={() => navigate(`/admin/tickets/${ticket.id}`)}
                                className={`admin-ticket-card ${ticket.status === 'in_progress' ? 'in_progress' : ticket.status}`}
                                >
                                    <div className="admin-ticket-content">
                                        <div className="admin-ticket-info">
                                            <h3>{ticket.title}</h3>
                                            <p>{ticket.description}</p>
                                            <small>
                                                {new Date(ticket.createdAt).toLocaleDateString('sr-RS')}
                                            </small>
                                            <small className="admin-ticket-user-id">
                                                User ID: {ticket.userId}
                                            </small>
                                        </div>
                                        <StatusBadge status={ticket.status} />
                                    </div>

                                </div>
                            ))}
                        </div>
                    )}
                </div>

            </main>

        </div>
    );
}

export default AdminDashboard;