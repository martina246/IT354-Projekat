import { useState, useEffect } from "react";
import "./CreateTicketModal.css";
import { createTicket } from "../api/tickets.api";
import { useAuth } from "../context/AuthContext";
import { getAllCategories } from "../api/categories.api";
import type { Category } from '../types/Category';

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
    const { user } = useAuth();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [categoryId, setCategoryId] = useState<string>('');
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(false);
    const [loadingCategories, setLoadingCategories] = useState(true);

    useEffect(() => {
        if (isOpen) {
            fetchCategories();
        }
    }, [isOpen]);

    const fetchCategories = async () => {
        try {
            const allCategories = await getAllCategories();
            setCategories(allCategories);
        } catch (error) {
            console.error('Error fetching categories:', error);
        } finally {
            setLoadingCategories(false);
        }
    };

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        if (!user) {
            console.error('User not logged in');
            setLoading(false);
            return;
        }

        try {
            await createTicket({
                userId: user.id,
                title,
                description,
                status: 'open',
                categoryId: categoryId || '',
            });

            setTitle('');
            setDescription('');
            setCategoryId('');
            onTicketCreated();
            onClose();

        } catch (error) {
            console.error('Error creating ticket: ', error);
            alert('Failed to create ticket');
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

                    <div className="modal-form-group">
                        <label className="modal-label">
                            Category (Optional)
                        </label>
                        {loadingCategories ? (
                            <div>Loading categories...</div>
                        ) : (
                            <select
                                value={categoryId}
                                onChange={(e) => setCategoryId(e.target.value)}
                                className="modal-input"
                            >
                                <option value="">No Category</option>
                                {categories.map((category) => (
                                    <option key={category.id} value={category.id}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                        )}
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