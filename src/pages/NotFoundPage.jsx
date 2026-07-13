import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Animated background blobs */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-brand-500/20 rounded-full blur-3xl animate-pulse pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-500/15 rounded-full blur-3xl animate-pulse pointer-events-none" style={{ animationDelay: '1s' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-pulse pointer-events-none" style={{ animationDelay: '2s' }} />

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
        style={{
          backgroundImage: `radial-gradient(circle, currentColor 1px, transparent 1px)`,
          backgroundSize: '24px 24px',
        }}
      />

      <div className="relative text-center slide-up">
        {/* Giant error code with gradient */}
        <div className="relative mb-2">
          <h1
            className="text-[11rem] sm:text-[16rem] lg:text-[20rem] font-black leading-none tracking-tighter select-none gradient-text opacity-80"
            style={{ filter: 'drop-shadow(0 0 40px rgba(99, 102, 241, 0.15))' }}
          >
            404
          </h1>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-48 h-1 rounded-full gradient-bg opacity-40 blur-sm" />
        </div>

        {/* SVG Illustration — lost / broken compass */}
        <div className="mx-auto mb-6 w-24 h-24 sm:w-28 sm:h-28">
          <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-lg">
            {/* Outer ring */}
            <circle cx="60" cy="60" r="50" className="stroke-brand-300 dark:stroke-brand-600" strokeWidth="3" strokeDasharray="8 4" opacity="0.6" />
            <circle cx="60" cy="60" r="40" className="stroke-brand-400 dark:stroke-brand-500" strokeWidth="2" opacity="0.4" />
            {/* Map / page with fold */}
            <rect x="38" y="36" width="44" height="52" rx="4" className="fill-white dark:fill-slate-700 stroke-brand-400 dark:stroke-brand-500" strokeWidth="2" />
            <path d="M38 36 L58 42 L82 36" className="stroke-brand-300 dark:stroke-brand-600" strokeWidth="1.5" fill="none" />
            {/* Question mark */}
            <path d="M54 56 C54 50, 66 50, 66 56 C66 62, 60 62, 60 66" className="stroke-brand-500 dark:stroke-brand-400" strokeWidth="3" strokeLinecap="round" fill="none" />
            <circle cx="60" cy="74" r="2" className="fill-brand-500 dark:fill-brand-400" />
            {/* Magnifying glass */}
            <circle cx="82" cy="82" r="10" className="stroke-accent-500 dark:stroke-accent-400" strokeWidth="2.5" fill="none" />
            <line x1="90" y1="90" x2="98" y2="98" className="stroke-accent-500 dark:stroke-accent-400" strokeWidth="3" strokeLinecap="round" />
            {/* X marks on map */}
            <line x1="44" y1="52" x2="48" y2="56" className="stroke-brand-300 dark:stroke-brand-600" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="48" y1="52" x2="44" y2="56" className="stroke-brand-300 dark:stroke-brand-600" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </div>

        {/* Subtitle */}
        <h2 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-slate-200 mb-3">
          Page not found
        </h2>
        <p className="text-slate-500 dark:text-slate-400 mb-10 max-w-md mx-auto leading-relaxed">
          The page you're looking for doesn't exist or has been moved to another location.
        </p>

        {/* Back to Home button */}
        <Link
          to="/"
          id="not-found-home-btn"
          className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl text-sm font-semibold
            text-white gradient-bg
            hover:opacity-90 active:scale-[0.97] transition-all duration-300
            shadow-lg shadow-brand-500/25 hover:shadow-brand-500/40"
        >
          Back to Home
          <Home className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
