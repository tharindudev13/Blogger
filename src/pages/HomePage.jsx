import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, PenSquare, Sparkles } from 'lucide-react';
import api from '../api/axios';
import PostCard from '../components/PostCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { useAuth } from '../context/AuthContext';

export default function HomePage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await api.get('/post/all');
      setPosts(res.data.posts || []);
    } catch (error) {
      console.error('Failed to fetch posts:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-bg opacity-5 dark:opacity-10" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-accent-500/10 rounded-full blur-3xl" />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
          <div className="text-center max-w-3xl mx-auto slide-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400 text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              Welcome to Blogger
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white mb-6 leading-tight">
              Share your{' '}
              <span className="gradient-text">stories</span>
              {' '}with the world
            </h1>

            <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 mb-10 leading-relaxed max-w-2xl mx-auto">
              A modern platform for writers and readers. Discover inspiring content, share your ideas, and connect with a vibrant community.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              {isAuthenticated ? (
                <Link
                  to="/create"
                  id="hero-create-btn"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-white font-semibold gradient-bg 
                    hover:opacity-90 active:scale-[0.98] transition-all duration-300 
                    shadow-lg shadow-brand-500/25 hover:shadow-brand-500/40"
                >
                  <PenSquare className="w-5 h-5" />
                  Write a post
                </Link>
              ) : (
                <Link
                  to="/register"
                  id="hero-register-btn"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-white font-semibold gradient-bg 
                    hover:opacity-90 active:scale-[0.98] transition-all duration-300 
                    shadow-lg shadow-brand-500/25 hover:shadow-brand-500/40"
                >
                  Get Started
                </Link>
              )}
              <a
                href="#posts"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-semibold 
                  text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 
                  border border-slate-200 dark:border-slate-700 
                  hover:border-brand-300 dark:hover:border-brand-500/40 
                  hover:shadow-lg transition-all duration-300"
              >
                <TrendingUp className="w-5 h-5" />
                Explore posts
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Posts Section */}
      <section id="posts" className="max-w-6xl mx-auto mt-12 px-4 sm:px-6 pb-20">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
              Latest Posts
            </h2>
            <p className="text-slate-500 dark:text-slate-400 mt-1">
              {posts.length} {posts.length === 1 ? 'story' : 'stories'} shared
            </p>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <LoadingSpinner size="lg" text="Loading posts..." />
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-6">
              <PenSquare className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-300 mb-2">
              No posts yet
            </h3>
            <p className="text-slate-500 dark:text-slate-400 mb-6">
              Be the first one to share a story!
            </p>
            {isAuthenticated && (
              <Link
                to="/create"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-white font-medium gradient-bg hover:opacity-90 transition-opacity"
              >
                <PenSquare className="w-4 h-4" />
                Create a post
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post, index) => (
              <PostCard key={post._id} post={post} index={index} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
