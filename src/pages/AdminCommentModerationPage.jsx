import { useEffect, useState, useRef } from 'react';
import { Navigate } from 'react-router';
import { useAuth } from '../context/AuthContext.jsx';
import ConfirmDialog from '../components/ConfirmDialog.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import { toast } from 'react-toastify';
import SearchField from '../components/SearchField.jsx';
import { useConfig } from '../context/ConfigContext.jsx';


export default function AdminCommentModerationPage() {

  const { dbUrl, webUrl } = useConfig();
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  if (!user || user.username !== 'admin') return <Navigate to="/" replace />;

  useEffect(() => {
    fetchComments();
  }, []);


  const fetchComments = async () => {
    setLoading(true);
    const res = await fetch(`${dbUrl}/comments`);
    const data = await res.json();
    setComments(data);
    setLoading(false);
  };

  const handleDeleteClick = (id) => {
    setSelectedId(id);
    setConfirmOpen(true);
  };

  const confirmDelete = async () => {
    await fetch(`${dbUrl}/comments/${selectedId}`, {
      method: 'DELETE',
    });
    setComments(prev => prev.filter(c => c.id !== selectedId));
    setConfirmOpen(false);
    setSelectedId(null);
    toast.success('Kommentar gelöscht.');
  };

  const filtered = comments.filter(c =>
    c.content.toLowerCase().includes(filter.toLowerCase()) ||
    c.author.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold mb-4">Kommentarverwaltung</h1>

      <SearchField
        label="Filter (Inhalt oder Autor)"
        value={filter}
        onChange={val => setFilter(val)}
        delay={300}
      />

      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="mt-4 space-y-4">
          {filtered.length === 0 ? (
            <p className="text-gray-500">Keine Kommentare gefunden.</p>
          ) : (
            filtered.map(c => (
              <div key={c.id} className="bg-base-200 p-4 rounded shadow-sm">
                <p className="font-semibold">{c.author}</p>
                <p className="mt-1">{c.content}</p>
                <button
                  className="btn btn-sm btn-outline btn-error mt-2"
                  onClick={() => handleDeleteClick(c.id)}
                >
                  Löschen
                </button>
              </div>
            ))
          )}
        </div>
      )}

      <ConfirmDialog
        open={confirmOpen}
        title="Kommentar löschen"
        message="Möchtest du diesen Kommentar wirklich löschen?"
        onConfirm={confirmDelete}
        onCancel={() => setConfirmOpen(false)}
      />
    </div>
  );
}
