import { useEffect, useState, useRef } from 'react';
import { Navigate } from 'react-router';
import { useAuth } from '../context/AuthContext.jsx';
import ConfirmDialog from '../components/ConfirmDialog.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import { toast } from 'react-toastify';
import SearchField from '../components/SearchField.jsx';
import { useDB } from './../context/DbContext.jsx';
import { list } from 'postcss';

export default function AdminCommentModerationPage() {

  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const { listComments, removeComment, data, loading } = useDB();

  if (!user || user.username !== 'admin') return <Navigate to="/" replace />;

  useEffect(() => {

    if (loading) {
      setLoading(true);
      setComments([]);
      setFilter('');
      setConfirmOpen(false);
      setSelectedId(null);
      return;
    }

    try {
      setLoading(true);
      fetchComments();
    } catch (error) {
      toast.error('Fehler beim Laden der Kommentare.');
    } finally {
      setLoading(false);
    }
  }, [loading]);


  const fetchComments = async () => {
    const data = await listComments();
    if (!data) {
      toast.error('Fehler beim Laden der Kommentare.');
      return;
    }
    setComments(data);
  };

  const handleDeleteClick = (id) => {
    setSelectedId(id);
    setConfirmOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await removeComment(selectedId);
      setComments(prev => prev.filter(c => c.id !== selectedId));
      toast.success('Kommentar gelöscht.');
    } catch (error) {
      toast.error(`Fehler beim Löschen des Kommentars: ${error}`);
    } finally {
      setConfirmOpen(false);
      setSelectedId(null);
      setLoading(false);
    }
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

      {isLoading ? (
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
