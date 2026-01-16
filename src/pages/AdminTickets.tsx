import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import type { Ticket } from "../types/Ticket";
import { useEffect, useState } from "react";
import { getAllTickets, deleteTicket } from "../api/tickets.api";
import Navbar from "../components/Navbar";
import StatusBadge from "../components/StatusBadge";

function AdminTickets() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [filteredTickets, setFilteredTickets] = useState<Ticket[]>([]);
    const [loading, setLoading] = useState(true);

    //filteri
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [dateFilter, setDateFilter] = useState<string>('all');


    useEffect(() => {
        fetchAllTickets();
    }, []);

    useEffect(() => {
        filterTickets();
    }, [searchQuery, statusFilter, dateFilter, tickets]);

    const fetchAllTickets = async () => {
        try {
            const allTickets = await getAllTickets();
            const sortedTickets = allTickets.sort((a: Ticket, b: Ticket) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
            setTickets(sortedTickets);
            setFilteredTickets(sortedTickets);
            
        } catch (error) {
            console.error('Error fetching tickets:', error);
        } finally {
            setLoading(false);
        }
    };

    const filterTickets = () => {
        //pravimo novu kopiju niza tickets kako bi smo mogli da menjamo(filtriramo) bez direktnog menjanja statea
        let filtered = [...tickets];

        if (searchQuery) {
            filtered = filtered.filter(ticket =>
                ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                ticket.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                ticket.id.toLowerCase().includes(searchQuery.toLocaleLowerCase()) ||
                ticket.userId.toLowerCase().includes(searchQuery.toLocaleLowerCase())
            );
        }

        if (statusFilter !== 'all') {
            filtered = filtered.filter(ticket => ticket.status === statusFilter);
        }

        if (dateFilter !== 'all') {
            const now = new Date();
            filtered = filtered.filter(ticket => {
                const ticketDate = new Date(ticket.createdAt);
                switch (dateFilter) {
                    case 'today':
                        return ticketDate.toDateString() === now.toDateString();
                    case 'week':
                        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                        return ticketDate >= weekAgo;
                    case 'month':
                        const monthAgo = new Date(now.getTime() - 24 * 60 * 60 * 30 * 1000);
                        return ticketDate >= monthAgo;
                    default:
                        return true;
                }
            });
        }

        setFilteredTickets(filtered);

    };

    const handleDelete = async (ticketId: string, e: React.MouseEvent) => {
        e.stopPropagation(); //da klik na delete ne okine klik na ceo red
        if (window.confirm('Are you sure you want to delete this ticket?')) {
            try {
                await deleteTicket(ticketId);
                fetchAllTickets(); //refresujemo listu
            } catch (error) {
                console.error('Error delteing ticket:', error);
                alert('Failed to delete ticket');
            }
        }
    };

    const handleView = (ticketId: string) => {
        navigate(`/admin/tickets/${ticketId}`);
    };

    const handleEdit = (ticketId: string, e: React.MouseEvent) => {
        e.stopPropagation();
        navigate(`/admin/tickets/${ticketId}?edit=true`);
    }

    if (loading) {
        return <div className="admin-tickets-loading">Loading...</div>;
    }

    if (!user) {
        return null;
    }

    return (
        <div className="admin-tickets-container">
            <Navbar />

            <main className="admin-tickets-main">   
                <h1 className="admin-tickets-title">All tickets</h1>

                {/*filteri*/}

                <div className="admin-tickets-filters">
                    <input type="text" placeholder="Search all tickets (title, description, ID, user ID)..."
                    value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="admin-search-input"
                    />

                    <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} 
                    className="admin-filter-select">
                        <option value="all">All Status</option>
                        <option value="open">Open</option>
                        <option value="in_progress">In Progress</option>
                        <option value="closed">Closed</option>
                    </select>

                    <select value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} className="admin-filter-select">
                        <option value="all">All Time</option>
                        <option value="today">Today</option>
                        <option value="week">This Week</option>
                        <option value="month">This Month</option>
                    </select>
                </div>

                {/*tabelica*/}
                <div className="admin-tickets-table-wrapper">
                    <table className="admin-tickets-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Title</th>
                                <th>Description</th>
                                <th>Status</th>
                                <th>User ID</th>
                                <th>Created</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredTickets.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="admin-table-empty">
                                        No tickets found
                                    </td>
                                </tr>
                            ) : (
                                filteredTickets.map((ticket) => (
                                    <tr key={ticket.id} onClick={() => handleView(ticket.id)} className="admin-table-row">
                                        <td className="admin-table-id">#{ticket.id}</td>
                                        <td className="admin-table-title">{ticket.title}</td>
                                        <td className="admin-table-description">
                                            {ticket.description.length > 50 ? `${ticket.description.substring(0, 50)}...` : ticket.description}
                                        </td>
                                        <td>
                                            <StatusBadge status={ticket.status} variant="small" />
                                        </td>
                                        <td className="admin-table-user-id">{ticket.userId}</td>
                                        <td className="admin-table-date">
                                            {new Date(ticket.createdAt).toLocaleDateString('sr-RS')}
                                        </td>
                                        <td className="admin-table-actions" onClick={(e) => e.stopPropagation()}>
                                            <button onClick={() => handleView(ticket.id)} className="admin-action-btn admin-view-btn">
                                                View
                                            </button>
                                            <button onClick={(e) => handleEdit(ticket.id, e)} className="admin-action-btn admin-edit-btn">
                                                Edit
                                            </button>
                                            <button onClick={(e) => handleDelete(ticket.id, e)} className="admin-action-btn admin-delete-btn">
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="admin-tickets-count">
                    Showing {filteredTickets.length} of {tickets.length} tickets
                </div>
            </main>

        </div>
    );



}

export default AdminTickets;