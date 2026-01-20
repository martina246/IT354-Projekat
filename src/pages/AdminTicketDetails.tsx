import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./AdminTicketDetails.css";
import Navbar from "../components/Navbar";
import StatusBadge from "../components/StatusBadge";
import type { Ticket } from '../types/Ticket';
import { getAllTickets, updateTicketStatus, deleteTicket, updateTicket } from "../api/tickets.api";
import { useAuth } from "../context/AuthContext";
import { getAllCategories } from "../api/categories.api";
import type { Category } from '../types/Category';
import { getCategoryName } from "../utils/categoryUtils";

function AdminTicketDetails() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [ticket, setTicket] = useState<Ticket | null>(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const [isEditMode, setIsEditMode] = useState(false);
    const [editTitle, setEditTitle] = useState('');
    const [editDescription, setEditDescription] = useState('');
    const [editStatus, setEditStatus] = useState<'open' | 'in_progress' | 'closed'>('open');
    const [editCategoryId, setEditCategoryId] = useState<string>('');
    const [categories, setCategories] = useState<Category[]>([]);

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const editParam = urlParams.get('edit');
        if (editParam === 'true') {
            setIsEditMode(true);
        }
        fetchTicket();
        fetchCategories();
    }, [id]);

    useEffect(() => {
        if (ticket) {
            setEditTitle(ticket.title);
            setEditDescription(ticket.description);
            setEditStatus(ticket.status);
            setEditCategoryId(ticket.categoryId || '');
        }
    }, [ticket]);

    const fetchCategories = async () => {
        try {
            const allCategories = await getAllCategories();
            setCategories(allCategories);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const fetchTicket = async () => {
        if (!id) return;
        try {
            const allTickets = await getAllTickets(); //getTicketById????
            const foundTicket = allTickets.find(t => t.id === id);
            if (foundTicket) {
                setTicket(foundTicket);
            } else {
                alert('Ticket not found');
                navigate('/admin/tickets');
            }
        } catch (error) {
            console.error('Error fetching ticket:', error);
            alert('Failed to load ticket');
            navigate('/admin/tickets');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (newStatus: 'open' | 'in_progress' | 'closed') => {
        if (!id || !ticket) return;
        setUpdating(true);
        try {
            await updateTicketStatus(id, newStatus);
            await fetchTicket();
        } catch (error) {
            console.error('Error updating status:', error);
            alert('Failed to update status');
        } finally {
            setUpdating(false);
        }
    };

    const handleSaveEdit = async () => {
        if (!id) return;
        setUpdating(true);
        try {
            await updateTicket(id, {
                title: editTitle,
                description: editDescription,
                status: editStatus,
                categoryId: editCategoryId,
            });
            setIsEditMode(false);
            await fetchTicket();
        } catch (error) {
            console.error('Error updating ticket:', error);
            alert('Failed to update ticket');
        } finally {
            setUpdating(false);
        }
    };

    const handleCancelEdit = () => {
        if (ticket) {
            setEditTitle(ticket.title);
            setEditDescription(ticket.description);
            setEditStatus(ticket.status);
            setEditCategoryId(ticket.categoryId || '');
        }
        setIsEditMode(false);
    };

    const handleDelete = async () => {
        if (!id) return;
        if (!window.confirm('Are you sure you want to delete this ticket? This action cannot be undone.')) {
            return;
        }
        setDeleting(true);
        try {
            await deleteTicket(id);
            navigate('/admin/tickets');
        } catch (error) {
            console.error('Error deleting ticket:', error);
            alert('Failed to delete ticket');
            setDeleting(false);
        }
    };

    if (loading) {
        return <div className="admin-details-loading">Loading...</div>;
    }

    if (!ticket || !user) {
        return null;
    }

    return (
        <div className="admin-details-container">
            <Navbar />
            
            <main className="admin-details-main">
                <div className="admin-details-header">
                    <button 
                        onClick={() => navigate('/admin/tickets')}
                        className="admin-back-button"
                    >
                        Back to Tickets
                    </button>
                    <h1 className="admin-details-title">Ticket Details</h1>
                </div>

                <div className="admin-details-content">
                    <div className="admin-detail-section">
                        <label className="admin-detail-label">Ticket ID</label>
                        <div className="admin-detail-value admin-ticket-id">#{ticket.id}</div>
                    </div>

                    <div className="admin-detail-section">
                        <label className="admin-detail-label">Title</label>
                        {isEditMode ? (
                            <input
                                type="text"
                                value={editTitle}
                                onChange={(e) => setEditTitle(e.target.value)}
                                className="admin-edit-input"
                            />
                        ) : (
                            <div className="admin-detail-value">{ticket.title}</div>
                        )}
                    </div>

                    <div className="admin-detail-section">
                        <label className="admin-detail-label">Description</label>
                        {isEditMode ? (
                            <textarea
                                value={editDescription}
                                onChange={(e) => setEditDescription(e.target.value)}
                                className="admin-edit-textarea"
                                rows={5}
                            />
                        ) : (
                            <div className="admin-detail-value admin-description">{ticket.description}</div>
                        )}
                    </div>

                    <div className="admin-detail-section">
                        <label className="admin-detail-label">Status</label>
                        <div className="admin-status-controls">
                            {isEditMode ? (
                                <select
                                    value={editStatus}
                                    onChange={(e) => setEditStatus(e.target.value as 'open' | 'in_progress' | 'closed')}
                                    className="admin-status-select"
                                >
                                    <option value="open">Open</option>
                                    <option value="in_progress">In Progress</option>
                                    <option value="closed">Closed</option>
                                </select>
                            ) : (
                                <>
                                    <StatusBadge status={ticket.status} />
                                    <div className="admin-status-buttons">
                                        {ticket.status !== 'open' && (
                                            <button
                                                onClick={() => handleStatusChange('open')}
                                                disabled={updating}
                                                className="admin-status-btn admin-status-open"
                                            >
                                                Set to Open
                                            </button>
                                        )}
                                        {ticket.status !== 'in_progress' && (
                                            <button
                                                onClick={() => handleStatusChange('in_progress')}
                                                disabled={updating}
                                                className="admin-status-btn admin-status-progress"
                                            >
                                                Set to In Progress
                                            </button>
                                        )}
                                        {ticket.status !== 'closed' && (
                                            <button
                                                onClick={() => handleStatusChange('closed')}
                                                disabled={updating}
                                                className="admin-status-btn admin-status-closed"
                                            >
                                                Set to Closed
                                            </button>
                                        )}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    <div className="admin-detail-section">
                        <label className="admin-detail-label">Category</label>
                        {isEditMode ? (
                            <select
                                value={editCategoryId}
                                onChange={(e) => setEditCategoryId(e.target.value)}
                                className="admin-status-select"
                            >
                                <option value="">No Category</option>
                                {categories.map((category) => (
                                    <option key={category.id} value={category.id}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                        ) : (
                            <div className="admin-detail-value">
                                {ticket.categoryId ? getCategoryName(ticket.categoryId, categories) : 'No Category'}
                            </div>
                        )}
                    </div>

                    <div className="admin-detail-section">
                        <label className="admin-detail-label">User ID</label>
                        <div className="admin-detail-value admin-user-id">{ticket.userId}</div>
                    </div>

                    <div className="admin-detail-section">
                        <label className="admin-detail-label">Created</label>
                        <div className="admin-detail-value">
                            {new Date(ticket.createdAt).toLocaleString('sr-RS', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                            })}
                        </div>
                    </div>
                </div>

                <div className="admin-details-actions">
                    {isEditMode ? (
                        <>
                            <button
                                onClick={handleCancelEdit}
                                className="admin-action-button admin-cancel-button"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSaveEdit}
                                disabled={updating || !editTitle.trim() || !editDescription.trim()}
                                className="admin-action-button admin-save-button"
                            >
                                {updating ? 'Saving...' : 'Save Changes'}
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                onClick={() => setIsEditMode(true)}
                                className="admin-action-button admin-edit-button"
                            >
                                Edit Ticket
                            </button>
                            <button
                                onClick={handleDelete}
                                disabled={deleting}
                                className="admin-action-button admin-delete-button"
                            >
                                {deleting ? 'Deleting...' : 'Delete Ticket'}
                            </button>
                        </>
                    )}
                </div>
            </main>
        </div>
    );

}

export default AdminTicketDetails;