import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext.jsx';

export default function CommentForm({ articleId, onAddComment }) {

    const { user } = useAuth();
    const [content, setContent] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {

        e.preventDefault();
        console.log('Form submitted');
debugger
        if (!content.trim()) {
            setError('Kommentar darf nicht leer sein.');
            return;
        }
        try {
            await onAddComment(content.trim());
            console.log('Kommentar wurde erfolgreich übergeben');
            setContent('');
            setError('');
        } catch (err) {
            console.error('Fehler beim Hinzufügen:', err);
            setError('Fehler beim Hinzufügen des Kommentars.');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-base-100 p-6 rounded-lg shadow border border-accent space-y-4">
            <h3 className="text-xl font-semibold">Neuer Kommentar als <span className="text-primary">{user.username}</span></h3>
            <textarea
                className="textarea textarea-bordered w-full"
                placeholder="Dein Kommentar..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button type='submit' className="btn btn-accent w-full">
                Kommentar absenden
            </button>
        </form>
    );
}
