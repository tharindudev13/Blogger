import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Heart, MessageCircle, Clock, User, ArrowLeft, Send, Edit3, Trash2, MoreHorizontal } from 'lucide-react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import LoadingSpinner from '../components/LoadingSpinner';

function timeAgo(dateString) {
  const now = new Date();
  const date = new Date(dateString);
  const seconds = Math.floor((now - date) / 1000);
  if (seconds < 60) return 'Just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
  return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

export default function PostDetailPage() {
  const { postId } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { addToast } = useToast();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [likeAnimating, setLikeAnimating] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editCommentText, setEditCommentText] = useState('');
  const [showActions, setShowActions] = useState(null);

  useEffect(() => {
    fetchPost();
  }, [postId]);

  const fetchPost = async () => {
    try {
      const res = await api.get(`/post/post/${postId}`);
      const p = res.data.post;
      setPost(p);
      setLikeCount(p.likes?.length || 0);
      setLiked(p.likes?.includes(user?.id) || false);
    } catch (error) {
      addToast('Failed to load post', 'error');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    if (!isAuthenticated) {
      addToast('Please log in to like posts', 'info');
      return;
    }
    try {
      setLikeAnimating(true);
      await api.post(`/post/like/${postId}`);
      setLiked(!liked);
      setLikeCount((prev) => (liked ? prev - 1 : prev + 1));
      setTimeout(() => setLikeAnimating(false), 400);
    } catch (error) {
      addToast('Failed to like post', 'error');
      setLikeAnimating(false);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    setSubmittingComment(true);
    try {
      await api.post(`/post/comment/${postId}`, { comment: comment.trim() });
      setComment('');
      addToast('Comment added!', 'success');
      fetchPost();
    } catch (error) {
      addToast('Failed to add comment', 'error');
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleEditComment = async (commentId) => {
    if (!editCommentText.trim()) return;
    try {
      await api.put(`/post/comment/${postId}/${commentId}`, { comment: editCommentText.trim() });
      setEditingCommentId(null);
      setEditCommentText('');
      addToast('Comment updated!', 'success');
      fetchPost();
    } catch (error) {
      addToast('Failed to update comment', 'error');
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await api.delete(`/post/comment/${postId}/${commentId}`);
      addToast('Comment deleted', 'success');
      fetchPost();
    } catch (error) {
      addToast('Failed to delete comment', 'error');
    }
  };

  const handleDeletePost = async () => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    try {
      await api.delete(`/post/delete/${postId}`);
      addToast('Post deleted', 'success');
      navigate('/');
    } catch (error) {
      addToast('Failed to delete post', 'error');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <LoadingSpinner size="lg" text="Loading post..." />
      </div>
    );
  }

  if (!post) return null;

  const isAuthor = user?.id === post.authorId;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      {/* Back Button */}
      <Link
        to="/"
        id="back-to-home"
        className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors mb-8"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to home
      </Link>

      {/* Post Content */}
      <article className="slide-up">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-6 leading-tight">
            {post.title}
          </h1>

          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full gradient-bg flex items-center justify-center shadow-lg shadow-brand-500/20">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="font-semibold text-slate-800 dark:text-slate-200">
                  {post.authorName || 'Anonymous'}
                </p>
                <div className="flex items-center gap-1.5 text-sm text-slate-400 dark:text-slate-500">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{timeAgo(post.createdAt)}</span>
                </div>
              </div>
            </div>

            {isAuthor && (
              <div className="flex items-center gap-2">
                <Link
                  to={`/edit/${post._id}`}
                  id="edit-post-btn"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium
                    text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-500/10 
                    hover:bg-brand-100 dark:hover:bg-brand-500/20 transition-all duration-300"
                >
                  <Edit3 className="w-4 h-4" />
                  Edit
                </Link>
                <button
                  id="delete-post-btn"
                  onClick={handleDeletePost}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium
                    text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10 
                    hover:bg-red-100 dark:hover:bg-red-500/20 transition-all duration-300"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-700 to-transparent mb-8" />

        {/* Body */}
        <div className="prose prose-lg dark:prose-invert max-w-none mb-10 text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
          {post.content}
        </div>

        {/* Actions Bar */}
        <div className="flex items-center gap-6 py-6 border-t border-b border-slate-200 dark:border-slate-700/50 mb-10">
          <button
            id="like-btn"
            onClick={handleLike}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 ${liked
              ? 'bg-accent-500/10 text-accent-500'
              : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-accent-500'
              }`}
          >
            <Heart
              className={`w-5 h-5 transition-all ${liked ? 'fill-accent-500' : ''} ${likeAnimating ? 'heart-beat' : ''}`}
            />
            <span className="text-sm font-semibold">{likeCount}</span>
          </button>
          <div className="flex items-center gap-2 text-slate-500">
            <MessageCircle className="w-5 h-5" />
            <span className="text-sm font-semibold">{post.comments?.length || 0} comments</span>
          </div>
        </div>

        {/* Comments Section */}
        <section id="comments-section">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">
            Comments
          </h2>

          {/* Add Comment */}
          {isAuthenticated && (
            <form onSubmit={handleComment} className="mb-8">
              <div className="flex gap-3">
                <div className="w-10 h-10 rounded-full gradient-bg flex items-center justify-center shrink-0 shadow-md shadow-brand-500/20">
                  <span className="text-xs font-bold text-white">
                    {(user?.email?.[0] || 'U').toUpperCase()}
                  </span>
                </div>
                <div className="flex-1">
                  <textarea
                    id="comment-input"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Write a comment..."
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 
                      text-slate-900 dark:text-white placeholder-slate-400 
                      focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 
                      transition-all duration-300 resize-none"
                  />
                  <div className="flex justify-end mt-2">
                    <button
                      id="submit-comment-btn"
                      type="submit"
                      disabled={!comment.trim() || submittingComment}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white gradient-bg
                        hover:opacity-90 active:scale-[0.98] transition-all duration-300 
                        shadow-md shadow-brand-500/20
                        disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {submittingComment ? (
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full spin-slow" />
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          Post
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </form>
          )}

          {/* Comment List */}
          <div className="space-y-4">
            {(!post.comments || post.comments.length === 0) ? (
              <div className="text-center py-10">
                <MessageCircle className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                <p className="text-slate-500 dark:text-slate-400">No comments yet. Be the first to share your thoughts!</p>
              </div>
            ) : (
              post.comments.map((c, idx) => (
                <div
                  key={c._id || idx}
                  className="group/comment flex gap-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 
                    border border-slate-100 dark:border-slate-700/40 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center shrink-0">
                    <User className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                        {c.userId === user?.id ? 'You' : c.fullName}
                      </p>
                      {c.userId === user?.id && (
                        <div className="relative">
                          <button
                            onClick={() => setShowActions(showActions === (c._id || idx) ? null : (c._id || idx))}
                            className="p-1 rounded-lg opacity-0 group-hover/comment:opacity-100 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
                          >
                            <MoreHorizontal className="w-4 h-4 text-slate-400" />
                          </button>
                          {showActions === (c._id || idx) && (
                            <div className="absolute right-0 top-7 z-10 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 py-1 min-w-[120px] fade-in">
                              <button
                                onClick={() => {
                                  setEditingCommentId(c._id || idx);
                                  setEditCommentText(c.comment);
                                  setShowActions(null);
                                }}
                                className="flex items-center gap-2 w-full px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                                Edit
                              </button>
                              <button
                                onClick={() => {
                                  handleDeleteComment(c._id);
                                  setShowActions(null);
                                }}
                                className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                Delete
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {editingCommentId === (c._id || idx) ? (
                      <div className="space-y-2">
                        <textarea
                          value={editCommentText}
                          onChange={(e) => setEditCommentText(e.target.value)}
                          rows={2}
                          className="w-full px-3 py-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 
                            text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500/50 resize-none"
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditComment(c._id)}
                            className="px-3 py-1.5 rounded-lg text-xs font-medium text-white gradient-bg hover:opacity-90"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => { setEditingCommentId(null); setEditCommentText(''); }}
                            className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-slate-700 dark:text-slate-300">{c.comment}</p>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </article>
    </div>
  );
}
