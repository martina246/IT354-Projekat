import { useState, useEffect } from "react";
import "./AdminCategories.css";
import Navbar from "../components/Navbar";
import type { Category } from '../types/Category';
import { getAllCategories, createCategory, updateCategory, deleteCategory } from "../api/categories.api";
import { useAuth } from "../context/AuthContext";
import { getAllTickets } from "../api/tickets.api";
import type { Ticket } from '../types/Ticket';

function AdminCategories() {
    const { user } = useAuth();
    const [categories, setCategories] = useState<Category[]>([]);
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);

    const [formName, setFormName] = useState('');
    const [formDescription, setFormDescription] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchCategories();
        fetchTickets();
    }, []);

    const fetchTickets = async () => {
        try {
            const allTickets = await getAllTickets();
            setTickets(allTickets);
        } catch (error) {
            console.error('Error fetching tickets:', error);
        }
    };

    const getTicketCountForCategory = (categoryId: string): number => {
        return tickets.filter(ticket => ticket.categoryId === categoryId).length;
    };

    const fetchCategories = async () => {
        try {
            const allCategories = await getAllCategories();
            setCategories(allCategories);
        } catch (error) {
            console.error('Error fetching categories:', error);
            alert('Failed to load categories');
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = () => {
        setEditingCategory(null);
        setFormName('');
        setFormDescription('');
        setShowCreateModal(true);
    };

    const handleEdit = (category: Category) => {
        setEditingCategory(category);
        setFormName(category.name);
        setFormDescription(category.description || '');
        setShowCreateModal(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formName.trim()) {
            alert('Category name is required');
            return;
        }

        setSubmitting(true);
        try {
            if (editingCategory) {
                await updateCategory(editingCategory.id, {
                    name: formName.trim(),
                    description: formDescription.trim() || undefined,
                });
            } else {
                await createCategory({
                    name: formName.trim(),
                    description: formDescription.trim() || undefined,
                });
            }

            setShowCreateModal(false);
            fetchCategories();
        } catch (error) {
            console.error('Error saving category:', error);
            alert('Failed to save category');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (categoryId: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (!window.confirm('Are you sure you want to delete this category? This will affect tickets using this category.')) {
            return;
        }
        try {
            await deleteCategory(categoryId);
            fetchCategories();
        } catch (error) {
            console.error('Error deleting category:', error);
            alert('Failed to delete category');
        }
    };

    const handleCancel = () => {
        setShowCreateModal(false);
        setEditingCategory(null);
        setFormName('');
        setFormDescription('');
    };

    if (loading) {
        return <div className="admin-categories-loading">Loading...</div>;
    }

    if (!user) {
        return null;
    }

    return (
<div className="admin-categories-container">
            <Navbar />
            
            <main className="admin-categories-main">
                <div className="admin-categories-header">
                    <h1 className="admin-categories-title">Categories</h1>
                    <button 
                        onClick={handleCreate}
                        className="admin-action-button admin-action-primary"
                    >
                        + Create Category
                    </button>
                </div>

                {categories.length === 0 ? (
                    <div className="admin-empty-message">
                        <p>No categories found. Create your first category!</p>
                    </div>
                ) : (
                    <div className="admin-categories-grid">
                        {categories.map((category) => (
                            <div key={category.id} className="admin-category-card">
                                <div className="admin-category-content">
                                    <h3 className="admin-category-name">{category.name}</h3>
                                    {category.description && (
                                        <p className="admin-category-description">{category.description}</p>
                                    )}
                                    <p className="admin-category-ticket-count">
                                        Tickets: {getTicketCountForCategory(category.id)}
                                    </p>
                                    {category.createdAt && (
                                        <small className="admin-category-date">
                                            Created: {new Date(category.createdAt).toLocaleDateString('sr-RS')}
                                        </small>
                                    )}
                                </div>
                                <div className="admin-category-actions">
                                    <button 
                                        onClick={() => handleEdit(category)}
                                        className="admin-action-btn admin-edit-btn"
                                    >
                                        Edit
                                    </button>
                                    <button 
                                        onClick={(e) => handleDelete(category.id, e)}
                                        className="admin-action-btn admin-delete-btn"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* create i edit modal */}
                {showCreateModal && (
                    <div className="admin-modal-overlay" onClick={handleCancel}>
                        <div className="admin-modal-content" onClick={(e) => e.stopPropagation()}>
                            <h2>{editingCategory ? 'Edit Category' : 'Create Category'}</h2>
                            <form onSubmit={handleSubmit}>
                                <div className="admin-form-group">
                                    <label>Name *</label>
                                    <input
                                        type="text"
                                        value={formName}
                                        onChange={(e) => setFormName(e.target.value)}
                                        className="admin-form-input"
                                        required
                                        disabled={submitting}
                                    />
                                </div>
                                <div className="admin-form-group">
                                    <label>Description</label>
                                    <textarea
                                        value={formDescription}
                                        onChange={(e) => setFormDescription(e.target.value)}
                                        className="admin-form-textarea"
                                        rows={3}
                                        disabled={submitting}
                                    />
                                </div>
                                <div className="admin-modal-actions">
                                    <button
                                        type="button"
                                        onClick={handleCancel}
                                        className="admin-action-button admin-cancel-button"
                                        disabled={submitting}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="admin-action-button admin-save-button"
                                        disabled={submitting}
                                    >
                                        {submitting ? 'Saving...' : editingCategory ? 'Update' : 'Create'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}

export default AdminCategories;