import { useState } from "react";
import "./CreateTicketModal.css";

interface CreateTicketModalProps {
    isOpen: boolean;
    onClose: () => void;
    onTicketCreated: () => void;
    //nema parametara ne vraca nista
}
//ove tri stvari su potrebne da se proslede glavnoj funkciji
//CreateTicketModal - ime komponente
//Props - podaci koje komponenta prima

function CreateTicketModal({isOpen, onClose, onTicketCreated} : CreateTicketModalProps) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        const loggedInUser = localStorage.getItem('loggedInUser');
        if (!loggedInUser) return;

        const user = JSON.parse(loggedInUser);

        try {
            const response = await fetch(`http://localhost:3001/tickets`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            body: JSON.stringify({
                userId: user.id,
                title,
                description,
                status: 'open',
                createdAt: new Date().toISOString()
            })
        });

        if (response.ok) {
            setTitle('');
            setDescription('');
            onTicketCreated();
            onClose();
        }

    } catch (error) {
        console.error('Error creating ticket: ', error);
    } finally {
        setLoading(false);
    }

    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h2>Create New Ticket</h2>
                    <button
                        onClick={onClose}
                        className="modal-close-button"
                    >
                        ×
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="modal-form-group">
                        <label className="modal-label">
                            Title
                        </label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            className="modal-input"
                        />
                    </div>

                    <div className="modal-form-group">
                        <label className="modal-label">
                            Description
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                            rows={4}
                            className="modal-textarea"
                        />
                    </div>

                    <div className="modal-actions">
                        <button
                            type="button"
                            onClick={onClose}
                            className="modal-button modal-button-cancel"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="modal-button modal-button-submit"
                        >
                            {loading ? 'Creating...' : 'Create Ticket'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );

    
}

export default CreateTicketModal;