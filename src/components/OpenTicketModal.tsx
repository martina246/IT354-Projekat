import { useState, useEffect } from "react";
import './OpenTicketModal.css';
import type { Ticket } from '../types/Ticket';
import { updateTicketStatus } from "../api/tickets.api";

interface OpenTicketModalProps {
    isOpen: boolean;
    onClose: () => void;
    ticket: Ticket | null;
    onTicketUpdated: () => void;
}

function OpenTicketModal ({isOpen, onClose, ticket, onTicketUpdated} : OpenTicketModalProps) {
    const [status, setStatus] = useState<'open' | 'in_progress' | 'closed'>('open');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (ticket) {
            setStatus(ticket.status);
        }
    }, [ticket]);

    if (!isOpen || !ticket) return null;

    const handleStatusUpdate = async () => {
        setLoading(true);
        try {
            await updateTicketStatus(ticket.id, status);
            onTicketUpdated();
            onClose();
        } catch (error) {
            console.error('Error updating ticket: ', error);
        } finally {
            setLoading(false);
        }

    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'open': return '#ff6b6b';
            case 'in_progress': return '#4ecdc4';
            case 'closed': return '#95e1d3';
            default: return '#ccc';
        }
    }

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'open': return 'Open';
            case 'in_progress': return 'In Progress';
            case 'closed': return 'Closed';
            default: return status;
        }
    }

    return (
        <div className="modal-overlay">
            <div className="modal-content ticket-details-modal">
                <div className="modal-header">
                    <h2>Ticket Details</h2>
                    <button
                        onClick={onClose}
                        className="modal-close-button"
                    >
                        ×
                    </button>
                </div>

                <div className="ticket-details-content">
                    <div className="ticket-detail-section">
                        <label className="ticket-detail-label">Title</label>
                        <div className="ticket-detail-value">{ticket.title}</div>
                    </div>

                    <div className="ticket-detail-section">
                        <label className="ticket-detail-label">Description</label>
                        <div className="ticket-detail-value ticket-description">
                            {ticket.description}
                        </div>
                    </div>

                    {/* status display i update */}
                    <div className="ticket-detail-section">
                        <label className="ticket-detail-label">Status</label>
                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                            <span 
                                className="ticket-status-badge"
                                style={{ backgroundColor: getStatusColor(ticket.status) }}
                            >
                                {getStatusLabel(ticket.status)}
                            </span>
                            <select
                                value={status}
                                onChange={(e) => setStatus(e.target.value as 'open' | 'in_progress' | 'closed')}
                                className="ticket-status-select"
                            >
                                <option value="open">Open</option>
                                <option value="in_progress">In Progress</option>
                                <option value="closed">Closed</option>
                            </select>
                        </div>
                    </div>

                    <div className="ticket-detail-section">
                        <label className="ticket-detail-label">Created</label>
                        <div className="ticket-detail-value">
                            {new Date(ticket.createdAt).toLocaleString('sr-RS', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                            })}
                        </div>
                    </div>

                    <div className="ticket-detail-section">
                        <label className="ticket-detail-label">Ticket ID</label>
                        <div className="ticket-detail-value ticket-id">#{ticket.id}</div>
                    </div>
                </div>

                <div className="modal-actions">
                    <button
                        type="button"
                        onClick={onClose}
                        className="modal-button modal-button-cancel"
                    >
                        Close
                    </button>
                    <button
                        type="button"
                        onClick={handleStatusUpdate}
                        disabled={loading || status === ticket.status}
                        className="modal-button modal-button-submit"
                    >
                        {loading ? 'Updating...' : 'Update Status'}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default OpenTicketModal;