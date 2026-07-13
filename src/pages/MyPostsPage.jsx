import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PenSquare, Edit3, Trash2, Heart, MessageCircle, Clock, LayoutGrid, List, User } from 'lucide-react';
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
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function MyPostsPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid');
  const { user } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchMyPosts();
  }, []);


  const fetchMyPosts = async () => {
    try {
      const res = await api.get('/post/user-posts', {
        data: { userId: user?.id },
      });

      setPosts(res.data.posts || []);
    } catch (error) {
      // Fallback: fetch all and filter
      try {
        const res = await api.get('/post/all');
        const myPosts = (res.data.posts || []).filter((p) => p.authorId === user?.id);
        setPosts(myPosts);
      } catch (e) {
        addToast('Failed to load your posts', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (postId) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    try {
      await api.delete(`/post/delete/${postId}`);
      setPosts((prev) => prev.filter((p) => p._id !== postId));
      addToast('Post deleted successfully', 'success');
    } catch (error) {
      addToast('Failed to delete post', 'error');
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <div className="slide-up">
        {/* Header */}
        <div className="flex items-center justify-between mb-10 flex-wrap gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-2">
              My Posts
            </h1>
            <p className="text-slate-500 dark:text-slate-400">
              Manage your published content • {posts.length} {posts.length === 1 ? 'post' : 'posts'}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {/* View Toggle */}
            <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-xl p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-all ${viewMode === 'grid'
                  ? 'bg-white dark:bg-slate-700 shadow-sm text-brand-600 dark:text-brand-400'
                  : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
                  }`}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-all ${viewMode === 'list'
                  ? 'bg-white dark:bg-slate-700 shadow-sm text-brand-600 dark:text-brand-400'
                  : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
                  }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
            <Link
              to="/create"
              id="my-posts-create-btn"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white gradient-bg 
                hover:opacity-90 active:scale-[0.98] transition-all duration-300 
                shadow-lg shadow-brand-500/25"
            >
              <PenSquare className="w-4 h-4" />
              New Post
            </Link>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex justify-center py-20">
            <LoadingSpinner size="lg" text="Loading your posts..." />
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-24 h-24 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-6">
              <PenSquare className="w-10 h-10 text-slate-400" />
            </div>
            <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-300 mb-2">
              No posts yet
            </h3>
            <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-md mx-auto">
              You haven&apos;t published any posts yet. Start sharing your stories with the world!
            </p>
            <Link
              to="/create"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-white font-semibold gradient-bg 
                hover:opacity-90 transition-opacity shadow-lg shadow-brand-500/25"
            >
              <PenSquare className="w-5 h-5" />
              Write your first post
            </Link>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post, index) => (
              <div
                key={post._id}
                className="group relative bg-white dark:bg-slate-800/80 rounded-2xl overflow-hidden
                  shadow-sm hover:shadow-xl dark:shadow-none
                  transition-all duration-500 ease-out hover:-translate-y-1
                  border border-slate-200/60 dark:border-slate-700/60 hover:border-brand-300 dark:hover:border-brand-500/40"
              >
                <div className="h-1 w-full gradient-bg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="p-6">
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 dark:text-slate-500 mb-3">
                    <Clock className="w-3 h-3" />
                    <span>{timeAgo(post.createdAt)}</span>
                  </div>

                  <h3
                    onClick={() => navigate(`/post/${post._id}`)}
                    className="text-lg font-bold text-slate-900 dark:text-white mb-3 cursor-pointer
                      group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors line-clamp-2"
                  >
                    {post.title}
                  </h3>

                  <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 mb-5">
                    {post.content}
                  </p>

                  {/* Stats */}
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center gap-1 text-slate-400">
                      <Heart className={`w-4 h-4 ${(post.likes?.length || 0) > 0 ? 'fill-accent-500 text-accent-500' : ''}`} />
                      <span className="text-xs font-medium">{post.likes?.length || 0}</span>
                    </div>
                    <div className="flex items-center gap-1 text-slate-400">
                      <MessageCircle className="w-4 h-4" />
                      <span className="text-xs font-medium">{post.comments?.length || 0}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-4 border-t border-slate-100 dark:border-slate-700/50">
                    <button
                      onClick={() => navigate(`/edit/${post._id}`)}
                      className="flex-1 inline-flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-medium
                        text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-500/10 
                        hover:bg-brand-100 dark:hover:bg-brand-500/20 transition-all"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(post._id)}
                      className="flex-1 inline-flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-medium
                        text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10 
                        hover:bg-red-100 dark:hover:bg-red-500/20 transition-all"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* List View */
          <div className="space-y-3">
            {posts.map((post) => (
              <div
                key={post._id}
                className="group flex items-center gap-4 sm:gap-6 p-4 sm:p-5 bg-white dark:bg-slate-800/80 rounded-xl
                  border border-slate-200/60 dark:border-slate-700/60 hover:border-brand-300 dark:hover:border-brand-500/40
                  shadow-sm hover:shadow-md transition-all duration-300"
              >
                <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center shrink-0 shadow-md shadow-brand-500/20">
                  <User className="w-5 h-5 text-white" />
                </div>

                <div className="flex-1 min-w-0 cursor-pointer" onClick={() => navigate(`/post/${post._id}`)}>
                  <h3 className="font-semibold text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors truncate">
                    {post.title}
                  </h3>
                  <div className="flex items-center gap-4 mt-1 text-xs text-slate-400 dark:text-slate-500">
                    <span>{timeAgo(post.createdAt)}</span>
                    <span className="flex items-center gap-1">
                      <Heart className="w-3 h-3" /> {post.likes?.length || 0}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageCircle className="w-3 h-3" /> {post.comments?.length || 0}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => navigate(`/edit/${post._id}`)}
                    className="p-2 rounded-lg text-brand-500 hover:bg-brand-50 dark:hover:bg-brand-500/10 transition-all"
                    title="Edit"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(post._id)}
                    className="p-2 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
