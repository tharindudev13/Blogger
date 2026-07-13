import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

export default function ServerErrorPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Animated background blobs — on-brand purple/pink */}
      <div className="absolute top-1/4 right-1/4 w-72 h-72 bg-purple-500/15 rounded-full blur-3xl animate-pulse pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-accent-500/15 rounded-full blur-3xl animate-pulse pointer-events-none" style={{ animationDelay: '1s' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-brand-500/10 rounded-full blur-3xl animate-pulse pointer-events-none" style={{ animationDelay: '2s' }} />

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
        style={{
          backgroundImage: `radial-gradient(circle, currentColor 1px, transparent 1px)`,
          backgroundSize: '24px 24px',
        }}
      />

      <div className="relative text-center slide-up">
        {/* Giant error code with purple-to-pink gradient */}
        <div className="relative mb-2">
          <h1
            className="text-[11rem] sm:text-[16rem] lg:text-[20rem] font-black leading-none tracking-tighter select-none opacity-80"
            style={{
              background: 'linear-gradient(135deg, #a855f7, #ec4899, #a855f7)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              filter: 'drop-shadow(0 0 40px rgba(168, 85, 247, 0.15))',
            }}
          >
            500
          </h1>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-48 h-1 rounded-full bg-gradient-to-r from-purple-500 via-accent-500 to-purple-500 opacity-40 blur-sm" />
        </div>

        {/* SVG Illustration — broken server / gears */}
        <div className="mx-auto mb-6 w-24 h-24 sm:w-28 sm:h-28">
          <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-lg">
            {/* Server box */}
            <rect x="28" y="30" width="50" height="60" rx="6" className="fill-white dark:fill-slate-700 stroke-purple-400 dark:stroke-purple-500" strokeWidth="2" />
            {/* Server lines */}
            <line x1="36" y1="46" x2="56" y2="46" className="stroke-purple-300 dark:stroke-purple-600" strokeWidth="2" strokeLinecap="round" />
            <line x1="36" y1="54" x2="50" y2="54" className="stroke-purple-300 dark:stroke-purple-600" strokeWidth="2" strokeLinecap="round" />
            <line x1="36" y1="62" x2="52" y2="62" className="stroke-purple-300 dark:stroke-purple-600" strokeWidth="2" strokeLinecap="round" />
            {/* LED dots */}
            <circle cx="66" cy="46" r="3" className="fill-accent-400 dark:fill-accent-500" opacity="0.8" />
            <circle cx="66" cy="54" r="3" className="fill-purple-300 dark:fill-purple-600" opacity="0.5" />
            <circle cx="66" cy="62" r="3" className="fill-purple-300 dark:fill-purple-600" opacity="0.5" />
            {/* Broken gear (top-right) */}
            <circle cx="88" cy="38" r="12" className="stroke-accent-500 dark:stroke-accent-400" strokeWidth="2.5" fill="none" />
            <circle cx="88" cy="38" r="4" className="fill-accent-500 dark:fill-accent-400" opacity="0.6" />
            {/* Gear teeth */}
            <line x1="88" y1="24" x2="88" y2="28" className="stroke-accent-500 dark:stroke-accent-400" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="88" y1="48" x2="88" y2="52" className="stroke-accent-500 dark:stroke-accent-400" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="74" y1="38" x2="78" y2="38" className="stroke-accent-500 dark:stroke-accent-400" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="98" y1="38" x2="102" y2="38" className="stroke-accent-500 dark:stroke-accent-400" strokeWidth="2.5" strokeLinecap="round" />
            {/* Crack / lightning bolt on server */}
            <path d="M46 70 L50 78 L44 80 L50 90" className="stroke-accent-500 dark:stroke-accent-400" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            {/* Sparks */}
            <circle cx="40" cy="76" r="1.5" className="fill-purple-400 dark:fill-purple-500" opacity="0.7" />
            <circle cx="54" cy="84" r="1" className="fill-accent-400 dark:fill-accent-500" opacity="0.6" />
            <circle cx="96" cy="28" r="1.5" className="fill-accent-400 dark:fill-accent-500" opacity="0.5" />
          </svg>
        </div>

        {/* Subtitle */}
        <h2 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-slate-200 mb-3">
          Internal server error
        </h2>
        <p className="text-slate-500 dark:text-slate-400 mb-10 max-w-md mx-auto leading-relaxed">
          Something went wrong on our end. Please try again later or head back to the homepage.
        </p>

        {/* Back to Home button */}
        <Link
          to="/"
          id="server-error-home-btn"
          className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl text-sm font-semibold
            text-white bg-gradient-to-r from-purple-500 to-accent-500
            hover:opacity-90 active:scale-[0.97] transition-all duration-300
            shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40"
        >
          Back to Home
          <Home className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
