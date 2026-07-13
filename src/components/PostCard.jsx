import { Heart, MessageCircle, Clock, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

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

export default function PostCard({ post, index = 0 }) {
  const navigate = useNavigate();

  const excerpt = post.content?.length > 150
    ? post.content.substring(0, 150) + '...'
    : post.content;

  const likeCount = post.likes?.length || 0;
  const commentCount = post.comments?.length || 0;

  return (
    <article
      id={`post-card-${post._id}`}
      onClick={() => navigate(`/post/${post._id}`)}
      className="group relative bg-white dark:bg-slate-800/80 rounded-2xl overflow-hidden cursor-pointer
        shadow-sm hover:shadow-xl dark:shadow-none dark:hover:shadow-2xl dark:hover:shadow-brand-500/5
        transition-all duration-500 ease-out hover:-translate-y-1
        border border-slate-200/60 dark:border-slate-700/60 hover:border-brand-300 dark:hover:border-brand-500/40"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Gradient top accent */}
      <div className="h-1 w-full gradient-bg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="p-6">
        {/* Author & Time */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full gradient-bg flex items-center justify-center shadow-md shadow-brand-500/20">
              <User className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                {post.authorName || 'Anonymous'}
              </p>
              <div className="flex items-center gap-1 text-xs text-slate-400 dark:text-slate-500">
                <Clock className="w-3 h-3" />
                <span>{timeAgo(post.createdAt)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Title */}
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3 
          group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors duration-300 line-clamp-2">
          {post.title}
        </h2>

        {/* Excerpt */}
        <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-5 line-clamp-3">
          {excerpt}
        </p>

        {/* Footer - Stats */}
        <div className="flex items-center gap-5 pt-4 border-t border-slate-100 dark:border-slate-700/50">
          <div className="flex items-center gap-1.5 text-slate-400 dark:text-slate-500">
            <Heart className={`w-4 h-4 ${likeCount > 0 ? 'fill-accent-500 text-accent-500' : ''}`} />
            <span className="text-xs font-medium">{likeCount}</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-400 dark:text-slate-500">
            <MessageCircle className="w-4 h-4" />
            <span className="text-xs font-medium">{commentCount}</span>
          </div>
          <span className="ml-auto text-xs font-medium text-brand-500 dark:text-brand-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            Read more →
          </span>
        </div>
      </div>
    </article>
  );
}
