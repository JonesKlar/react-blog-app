// pages/ArticlePage.jsx
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router';
import { useAuth } from '../context/AuthContext.jsx';
import CommentForm from '../components/CommentForm.jsx';
import ConfirmDialog from '../components/ConfirmDialog.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import { toast } from 'react-toastify';
import NotFound from '../pages/NotFound.jsx';
import { useDB } from './../context/DbContext.jsx';

export default function ArticlePage() {

  const isDev = import.meta.env.DEV

  const { id } = useParams(); // Get the article ID from the URL
  const { user } = useAuth(); // Get the authenticated user from the AuthContext

  // useState hooks
  const [article, setArticle] = useState(null); // State to store the article data
  const [comments, setComments] = useState([]); // State to store the comments
  const [isLoading, setLoading] = useState(true); // State to manage loading status
  const [notFound, setNotFound] = useState(false); // State to handle 404 errors
  const [confirmOpen, setConfirmOpen] = useState(false); // State to manage the confirmation dialog
  const [commentIdToBeDeleted, setCommentIdToBeDeleted] = useState(null); // State to track the comment to delete
  const [editingId, setEditingId] = useState(null); // State to track the comment being edited
  const [editContent, setEditContent] = useState(''); // State to store the content of the comment being edited

  const {
    data,
    loading,
    error,
    getArticle,
    listComments,
    getComment,
    getCommentsByArticleId,
    addComment,
    editComment,
    removeComment } = useDB(); // Get the authenticated user from the DB context

  // Fetch the article and its comments when the component mounts or the article ID changes
  useEffect(() => {

    // only run once the DBProvider has finished loading!
    if (loading) return

    const load = async () => {

      setLoading(true);
      setNotFound(false);
      let dataArticle = null;
      let dataComments = null;

      try {
        dataArticle = await getArticle(parseInt(id)); // Fetch the article data
        dataComments = data.comments.filter(c => c.articleId === parseInt(id));
        if (!dataArticle) {
          setNotFound(true); // Set notFound to true if the article is not found
          return;
        }
        setArticle(dataArticle); // Set the article data
        setComments(dataComments); // Set the comments
      } catch (error) {
        toast.error(`Fehler beim Laden des Artikels: ${error}`); // Show error toast
        setNotFound(true); // Handle errors by showing the NotFound page
      } finally {
        setLoading(false); // Stop the loading spinner
      }
    };
    load();
  }, [loading, id, getArticle, data.comments]);

  // Handle adding a new comment
  const handleAddComment = async (content) => {
    if (!user?.username) return; // Ensure the user is logged in

    const newComment = {
      articleId: parseInt(id),
      author: user.username,
      content: content.trim(),
    };

    try {
      const updatedComment = await addComment(newComment);

      if (isDev) {
        // setComments(prev => prev.map(c => c.id === updatedComment.id ? updatedComment : c));

        async function loadComments() {
          const data = await getCommentsByArticleId(parseInt(id));
          setComments(data);
        }
        loadComments();
        // setComments(data.comments)
        setEditingId(null); // Clear the editing state
      }

      toast.success('Kommentar hinzugefügt.'); // Show success toast
    } catch (error) {
      toast.error('Fehler beim Speichern des Kommentars: ' + error); // Show error toast
      return;
    }

  }; // handleAddComment

  // Handle clicking the delete button for a comment
  const handleDeleteClick = (cid) => {

    setCommentIdToBeDeleted(cid); // Set the comment to delete
    setConfirmOpen(true); // Open the confirmation dialog
  };

  // Confirm and delete the selected comment
  const confirmDelete = async () => {
    try {
      await removeComment(commentIdToBeDeleted); // delete comment
      if (isDev) {
        // setComments(prev => prev.map(c => c.id !== commentIdToBeDeleted)); // Add the new comment to the state
        setComments(prev => prev.filter(c => c.id !== commentIdToBeDeleted));

        setEditingId(null); // Clear the editing state
        toast.success('Kommentar gelöscht.'); // Show success toast
      }
    } catch (error) {
      toast.error('Fehler beim Löschen des Kommentars: ' + error); // Show error toast
    } finally {
      setConfirmOpen(false); // Close the confirmation dialog
    }
  };

  // Handle clicking the edit button for a comment
  const handleEditClick = (cid, content) => {
    setEditingId(cid); // Set the comment being edited
    setEditContent(content); // Set the content of the comment being edited
  };

  // Save the edited comment
  const handleEditSave = async (cid) => {
    try {
      let commentToBeUpdated = { content: editContent }

      if (isDev) {
        const originalComment = await getComment(cid)
        commentToBeUpdated = { ...originalComment, content: editContent }
      }

      const updatedComment = await editComment(cid, commentToBeUpdated); // Update the comment in the database    
      if (isDev) {
        // setComments(prev => [...prev, updatedComment]); // Add the new comment to the state
        // setComments(prev => prev.map(c => (c.id === cid ? updatedComment : c)))
        async function loadComments() {
          const data = await getCommentsByArticleId(parseInt(id));
          console.log(data);
          setComments(data);
        }
        loadComments();
      }
      setEditingId(null); // Clear the editing state
      toast.info('Kommentar aktualisiert.'); // Show info toast
    } catch (error) {
      toast.error('Fehler beim Aktualisieren des Kommentars: ' + error); // Show error toast
    }
  };

  // Show a loading spinner while the article is being fetched
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner message="Artikel wird geladen..." size="lg" />
      </div>
    );
  }

  // Show the NotFound page if the article is not found
  if (notFound) {
    return <NotFound />;
  }
  console.log(comments);

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      {/* Article title and content */}
      <h1 className="text-3xl font-bold mb-2">{article.title}</h1>
      <p className="mb-6">{article.content}</p>

      {/* Comments section */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Kommentare</h2>
        {comments.length === 0 && (
          <p className="text-sm text-gray-500">Noch keine Kommentare.</p> // Show message if no comments
        )}

        {/* List of comments */}
        <div className="space-y-4 mb-6">
          {comments.map(({ id: cid, author, content }) => (
            <div key={cid} className="bg-base-200 p-4 rounded shadow-md">
              <div className="flex justify-between items-start">
                <p className="font-semibold">{author}</p>
                {user?.username === author && (
                  <div className="flex gap-2 text-sm">
                    {/* Edit button */}
                    <button
                      onClick={() => handleEditClick(cid, content)}
                      className="btn btn-sm btn-outline btn-info"
                    >
                      Bearbeiten
                    </button>
                    {/* Delete button */}
                    <button
                      onClick={() => handleDeleteClick(cid)}
                      className="btn btn-sm btn-outline btn-error"
                    >
                      Löschen
                    </button>
                  </div>
                )}
              </div>

              {/* Edit mode or display comment content */}
              {editingId === cid ? (
                <div className="mt-2 space-y-2">
                  <textarea
                    className="textarea textarea-bordered w-full"
                    value={editContent}
                    onChange={e => setEditContent(e.target.value)}
                  />
                  <button
                    onClick={() => handleEditSave(cid)}
                    className="btn btn-sm btn-primary"
                  >
                    Speichern
                  </button>
                </div>
              ) : (
                <p className="mt-1">{content}</p>
              )}
            </div>
          ))}
        </div>

        {/* Comment form or login prompt */}
        {user ? (
          <CommentForm articleId={id} onAddComment={handleAddComment} />
        ) : (

          <Link
            to={`/login`}
            className="btn btn-sm btn-outline text-sm"
          >
            Bitte einloggen, um zu kommentieren
          </Link>
        )}
      </section>

      {/* Confirmation dialog for deleting a comment */}
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
