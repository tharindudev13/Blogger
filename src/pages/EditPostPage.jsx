import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Type, FileText, Save, ArrowLeft } from 'lucide-react';
import api from '../api/axios';
import { useToast } from '../components/Toast';
import LoadingSpinner from '../components/LoadingSpinner';

export default function EditPostPage() {
  const { postId } = useParams();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();
  const { addToast } = useToast();

  useEffect(() => {
    fetchPost();
  }, [postId]);

  const fetchPost = async () => {
    try {
      const res = await api.get(`/post/post/${postId}`);
      setTitle(res.data.post.title);
      setContent(res.data.post.content);
    } catch (error) {
      addToast('Failed to load post', 'error');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      addToast('Please fill in both title and content', 'error');
      return;
    }
    setSaving(true);
    try {
      await api.put(`/post/update/${postId}`, { title: title.trim(), content: content.trim() });
      addToast('Post updated successfully! ✨', 'success');
      navigate(`/post/${postId}`);
    } catch (error) {
      addToast(error.response?.data?.message || 'Failed to update post', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <LoadingSpinner size="lg" text="Loading post..." />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors mb-8"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>

      <div className="slide-up">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-2">
            Edit post
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            Update your post content and save the changes.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <label htmlFor="edit-title" className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
              <Type className="w-4 h-4 text-brand-500" />
              Title
            </label>
            <input
              id="edit-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="An attention-grabbing title..."
              className="w-full px-5 py-4 rounded-xl bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 
                text-xl font-semibold text-slate-900 dark:text-white placeholder-slate-400 
                focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 
                transition-all duration-300"
            />
          </div>

          {/* Content */}
          <div className="space-y-2">
            <label htmlFor="edit-content" className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
              <FileText className="w-4 h-4 text-brand-500" />
              Content
            </label>
            <textarea
              id="edit-content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Tell your story..."
              rows={14}
              className="w-full px-5 py-4 rounded-xl bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 
                text-slate-900 dark:text-white placeholder-slate-400 leading-relaxed
                focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 
                transition-all duration-300 resize-none"
            />
            <p className="text-xs text-slate-400 dark:text-slate-500 text-right">
              {content.length} characters
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => navigate(`/post/${postId}`)}
              className="px-5 py-3 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-400 
                bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 
                transition-all duration-300"
            >
              Cancel
            </button>
            <button
              id="save-changes-btn"
              type="submit"
              disabled={saving || !title.trim() || !content.trim()}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white gradient-bg 
                hover:opacity-90 active:scale-[0.98] transition-all duration-300 
                shadow-lg shadow-brand-500/25 hover:shadow-brand-500/40
                disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full spin-slow" />
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
