import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminUsers.css";
import Navbar from "../components/Navbar";
import StatusBadge from "../components/StatusBadge";
import type { User } from '../types/User';
import type { Ticket } from '../types/Ticket';
import { getAllUsers, getTicketsByUser } from "../api/users.api";
import { useAuth } from "../context/AuthContext";

function AdminUsers() {
    const { user: currentUser } = useAuth();
    const navigate = useNavigate();
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
    const [userTickets, setUserTickets] = useState <Ticket[]>([]);
    const [loadingTickets, setLoadingTickets] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const allUsers = await getAllUsers();
            setUsers(allUsers);
        } catch (error) {
            console.error('Error fetching users:', error);
            alert('Failed to load users');
        } finally {
            setLoading(false);
        }
    };

    const handleViewTickets = async (userId: string) => {
        setSelectedUserId(userId);
        setLoadingTickets(true);
        try {
            const tickets = await getTicketsByUser(userId);
            setUserTickets(tickets);
        } catch (error) {
            console.error('Error fetching user tickets:', error);
            alert('Failed to load user tickets');
        } finally {
            setLoadingTickets(false);
        }
    };

    const handleCloseTickets = () => {
        setSelectedUserId(null);
        setUserTickets([]);
    };

    const filteredUsers = users.filter(user => 
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.id.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) {
        return <div className="admin-users-loading">Loading...</div>
    }

    if (!currentUser) {
        return null;
    }

    return (
        <div className="admin-users-container">
            <Navbar />
            
            <main className="admin-users-main">
                <h1 className="admin-users-title">Users</h1>

                <div className="admin-users-filters">
                    <input 
                        type="text" 
                        placeholder="Search users (name, email, ID)..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="admin-search-input"
                    />
                </div>

                <div className="admin-users-table-wrapper">
                    <table className="admin-users-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Last Name</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="admin-table-empty">
                                        No users found
                                    </td>
                                </tr>
                            ) : (
                                filteredUsers.map((user) => (
                                    <tr key={user.id} className="admin-table-row">
                                        <td className="admin-table-id">#{user.id}</td>
                                        <td>{user.name}</td>
                                        <td>{user.lastName}</td>
                                        <td>{user.email}</td>
                                        <td>
                                            <span className={`admin-role-badge ${user.role === 'admin' ? 'admin-role' : 'user-role'}`}>
                                                {user.role || 'user'}
                                            </span>
                                        </td>
                                        <td className="admin-table-actions">
                                            <button 
                                                onClick={() => handleViewTickets(user.id)}
                                                className="admin-action-btn admin-view-btn"
                                            >
                                                View Tickets
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="admin-users-count">
                    Showing {filteredUsers.length} of {users.length} users
                </div>

                {selectedUserId && (
                    <div className="admin-user-tickets-overlay" onClick={handleCloseTickets}>
                        <div className="admin-user-tickets-content" onClick={(e) => e.stopPropagation()}>
                            <div className="admin-user-tickets-header">
                                <h2>
                                    Tickets for {users.find(u => u.id === selectedUserId)?.name}{' '}
                                    {users.find(u => u.id === selectedUserId)?.lastName}
                                </h2>
                                <button onClick={handleCloseTickets} className="admin-close-button">×</button>
                            </div>
                            
                            {loadingTickets ? (
                                <div className="admin-loading">Loading tickets...</div>
                            ) : userTickets.length === 0 ? (
                                <div className="admin-empty-message">No tickets found for this user</div>
                            ) : (
                                <div className="admin-user-tickets-list">
                                    {userTickets.map((ticket) => (
                                        <div 
                                            key={ticket.id} 
                                            className="admin-user-ticket-card"
                                            onClick={() => navigate(`/admin/tickets/${ticket.id}`)}
                                        >
                                            <div className="admin-user-ticket-info">
                                                <h3>{ticket.title}</h3>
                                                <p>{ticket.description}</p>
                                                <small>
                                                    {new Date(ticket.createdAt).toLocaleDateString('sr-RS')}
                                                </small>
                                            </div>
                                            <StatusBadge status={ticket.status} />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}

export default AdminUsers;