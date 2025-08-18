import React, { useState, useEffect, useContext, useRef } from "react";
import { AuthContext } from "../../context/AuthContext";
import {
  getCommentsByChapter,
  createComment,
  updateComment,
  deleteComment,
  toggleLikeComment,
} from "../../apis/comment.api";
import {
  FaHeart,
  FaRegHeart,
  FaEdit,
  FaTrash,
  FaReply,
  FaUser,
} from "react-icons/fa";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { motion, AnimatePresence } from "framer-motion";

// ✅ Composant pour gérer le texte réduit / agrandi avec animation
const CommentContent = ({ content }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [shouldTruncate, setShouldTruncate] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };

    handleResize(); // initial
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (isMobile && content.length > 300) {
      setShouldTruncate(true);
    } else {
      setShouldTruncate(false);
    }
  }, [content, isMobile]);

  return (
    <div className="relative text-gray-300">
      <AnimatePresence initial={false}>
        <motion.div
          key={isExpanded ? "expanded" : "collapsed"}
          initial={{ height: 0, opacity: 0 }}
          animate={{
            height: "auto",
            opacity: 1,
            transition: { duration: 0.3 },
          }}
          exit={{ height: 0, opacity: 0, transition: { duration: 0.2 } }}
        >
          <div
            className={`whitespace-pre-wrap break-words transition-all duration-300 ease-in-out ${
              shouldTruncate && !isExpanded
                ? "max-h-[6.5rem] overflow-hidden relative"
                : ""
            }`}
          >
            {content}
            {shouldTruncate && !isExpanded && (
              <div className="absolute bottom-0 left-0 w-full h-10 bg-gradient-to-t from-gray-800 to-transparent pointer-events-none" />
            )}
          </div>
        </motion.div>
      </AnimatePresence>

      {shouldTruncate && (
        <div className="w-full flex justify-end -mt-1">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-sm text-accent hover:underline focus:outline-none"
          >
            {isExpanded ? "Réduire" : "Lire plus"}
          </button>
        </div>
      )}
    </div>
  );
};

const ChapterComments = ({ chapterId, mangaId }) => {
  const { user } = useContext(AuthContext);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newComment, setNewComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [editingComment, setEditingComment] = useState(null);
  const [editContent, setEditContent] = useState("");
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalComments: 0,
    hasNextPage: false,
  });

  const loadComments = async (page = 1) => {
    try {
      setLoading(true);
      const response = await getCommentsByChapter(chapterId, page, 20);
      if (response.success) {
        if (page === 1) {
          setComments(response.data.comments);
        } else {
          setComments((prev) => [...prev, ...response.data.comments]);
        }
        setPagination(response.data.pagination);
      }
    } catch (err) {
      setError("Erreur lors du chargement des commentaires");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (chapterId) loadComments();
  }, [chapterId]);

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !user) return;
    try {
      setSubmitting(true);
      const response = await createComment({
        chapterId,
        mangaId,
        content: newComment.trim(),
      });
      if (response.success) {
        setComments((prev) => [response.data, ...prev]);
        setNewComment("");
        setPagination((prev) => ({
          ...prev,
          totalComments: prev.totalComments + 1,
        }));
      }
    } catch (err) {
      setError("Erreur lors de la création du commentaire");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditComment = async (commentId) => {
    if (!editContent.trim()) return;
    try {
      const response = await updateComment(commentId, editContent.trim());
      if (response.success) {
        setComments((prev) =>
          prev.map((comment) =>
            comment._id === commentId ? response.data : comment
          )
        );
        setEditingComment(null);
        setEditContent("");
      }
    } catch (err) {
      setError("Erreur lors de la modification du commentaire");
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce commentaire ?"))
      return;

    try {
      const response = await deleteComment(commentId);
      if (response.success) {
        setComments((prev) =>
          prev.filter((comment) => comment._id !== commentId)
        );
        setPagination((prev) => ({
          ...prev,
          totalComments: Math.max(0, prev.totalComments - 1),
        }));
      }
    } catch (err) {
      setError("Erreur lors de la suppression du commentaire");
    }
  };

  const handleToggleLike = async (commentId) => {
    if (!user) return;
    try {
      const response = await toggleLikeComment(commentId);
      if (response.success) {
        setComments((prev) =>
          prev.map((comment) =>
            comment._id === commentId
              ? {
                  ...comment,
                  likesCount: response.data.likesCount,
                  likes: response.data.liked
                    ? [...(comment.likes || []), user._id]
                    : (comment.likes || []).filter((id) => id !== user._id),
                }
              : comment
          )
        );
      }
    } catch (err) {
      setError("Erreur lors du like");
    }
  };

  const loadMoreComments = () => {
    if (pagination.hasNextPage) {
      loadComments(pagination.currentPage + 1);
    }
  };

  const formatDate = (date) => {
    try {
      return formatDistanceToNow(new Date(date), {
        addSuffix: true,
        locale: fr,
      });
    } catch {
      return "Il y a quelque temps";
    }
  };

  if (loading && comments.length === 0) {
    return (
      <div className="bg-dark-bg rounded-lg p-6 mt-8">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-700 rounded w-1/4 mb-4"></div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex space-x-3">
                <div className="w-10 h-10 bg-gray-700 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-700 rounded w-1/4"></div>
                  <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-dark-bg rounded-lg p-6 mt-8">
      <h3 className="text-xl font-bold text-white mb-6">
        Commentaires ({pagination.totalComments})
      </h3>

      {error && (
        <div className="bg-red-500/20 border border-red-500 text-red-300 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Nouveau commentaire */}
      {user ? (
        <form onSubmit={handleSubmitComment} className="mb-6">
          <div className="flex space-x-3">
            <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center flex-shrink-0">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.username}
                  className="w-full h-full rounded-full object-cover"
                  loading="lazy"
                  decoding="async"
                  width="40"
                  height="40"
                />
              ) : (
                <FaUser className="text-dark-bg" />
              )}
            </div>
            <div className="flex-1">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Écrivez votre commentaire..."
                className="w-full bg-gray-800 text-white rounded-lg p-3 resize-none focus:outline-none focus:ring-2 focus:ring-accent"
                rows="3"
                maxLength="1000"
                disabled={submitting}
              />
              <div className="flex justify-between items-center mt-2">
                <span className="text-gray-400 text-sm">
                  {newComment.length}/1000
                </span>
                <button
                  type="submit"
                  disabled={!newComment.trim() || submitting}
                  className="bg-accent text-dark-bg px-4 py-2 rounded-lg font-medium hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
                >
                  {submitting ? "Publication..." : "Publier"}
                </button>
              </div>
            </div>
          </div>
        </form>
      ) : (
        <div className="bg-gray-800 rounded-lg p-4 mb-6 text-center">
          <p className="text-gray-300">
            <a href="/login" className="text-accent hover:underline">
              Connectez-vous
            </a>{" "}
            pour laisser un commentaire
          </p>
        </div>
      )}

      {/* Liste des commentaires */}
      <div className="space-y-4">
        {comments.map((comment) => (
          <div key={comment._id} className="bg-gray-800 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center flex-shrink-0">
                {comment.userAvatar ? (
                  <img
                    src={comment.userAvatar}
                    alt={comment.username}
                    className="w-full h-full rounded-full object-cover"
                    loading="lazy"
                    decoding="async"
                    width="40"
                    height="40"
                  />
                ) : (
                  <FaUser className="text-dark-bg" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="font-medium text-white">
                    {comment.username}
                  </span>
                  <span className="text-gray-400 text-sm">
                    {formatDate(comment.createdAt)}
                  </span>
                  {comment.isEdited && (
                    <span className="text-gray-500 text-xs">(modifié)</span>
                  )}
                </div>

                {editingComment === comment._id ? (
                  <div className="space-y-2">
                    <textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      className="w-full bg-gray-700 text-white rounded p-2 resize-none focus:outline-none focus:ring-2 focus:ring-accent"
                      rows="3"
                      maxLength="1000"
                    />
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditComment(comment._id)}
                        className="bg-accent text-dark-bg px-3 py-1 rounded text-sm hover:bg-accent/90 cursor-pointer"
                      >
                        Sauvegarder
                      </button>
                      <button
                        onClick={() => {
                          setEditingComment(null);
                          setEditContent("");
                        }}
                        className="bg-gray-600 text-white px-3 py-1 rounded text-sm hover:bg-gray-500 cursor-pointer"
                      >
                        Annuler
                      </button>
                    </div>
                  </div>
                ) : (
                  <CommentContent content={comment.content} />
                )}

                <div className="flex items-center space-x-4 mt-3">
                  {user && (
                    <button
                      onClick={() => handleToggleLike(comment._id)}
                      className="flex items-center space-x-1 text-gray-400 hover:text-red-400 transition-colors cursor-pointer"
                    >
                      {comment.likes?.includes(user._id) ? (
                        <FaHeart className="text-red-400" />
                      ) : (
                        <FaRegHeart />
                      )}
                      <span className="text-sm">{comment.likesCount || 0}</span>
                    </button>
                  )}

                  {user && user._id === comment.userId._id && (
                    <>
                      <button
                        onClick={() => {
                          setEditingComment(comment._id);
                          setEditContent(comment.content);
                        }}
                        className="flex items-center space-x-1 text-gray-400 hover:text-accent transition-colors cursor-pointer"
                      >
                        <FaEdit />
                        <span className="text-sm">Modifier</span>
                      </button>
                      <button
                        onClick={() => handleDeleteComment(comment._id)}
                        className="flex items-center space-x-1 text-gray-400 hover:text-red-400 transition-colors cursor-pointer"
                      >
                        <FaTrash />
                        <span className="text-sm">Supprimer</span>
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bouton "Charger plus" */}
      {pagination.hasNextPage && (
        <div className="text-center mt-6">
          <button
            onClick={loadMoreComments}
            disabled={loading}
            className="bg-gray-700 text-white px-6 py-2 rounded-lg hover:bg-gray-600 disabled:opacity-50 transition-colors cursor-pointer"
          >
            {loading ? "Chargement..." : "Charger plus de commentaires"}
          </button>
        </div>
      )}

      {comments.length === 0 && !loading && (
        <div className="text-center py-8">
          <p className="text-gray-400">
            Aucun commentaire pour le moment. Soyez le premier à commenter !
          </p>
        </div>
      )}
    </div>
  );
};

export default ChapterComments;
