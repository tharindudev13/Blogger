import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, User, Calendar, AtSign, ArrowRight, Feather } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';

export default function RegisterPage() {
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    fullName: '',
    age: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const { register, loading } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.username || !form.email || !form.password || !form.fullName || !form.age) {
      addToast('Please fill in all fields', 'error');
      return;
    }
    if (form.password.length < 6) {
      addToast('Password must be at least 6 characters', 'error');
      return;
    }
    const result = await register({
      ...form,
      age: parseInt(form.age, 10),
    });
    if (result.success) {
      addToast('Account created successfully! Please log in. 🎉', 'success');
      navigate('/login');
    } else {
      addToast(result.message, 'error');
    }
  };

  const fields = [
    { key: 'fullName', label: 'Full Name', type: 'text', icon: User, placeholder: 'John Doe' },
    { key: 'username', label: 'Username', type: 'text', icon: AtSign, placeholder: 'johndoe' },
    { key: 'email', label: 'Email', type: 'email', icon: Mail, placeholder: 'you@example.com' },
    { key: 'age', label: 'Age', type: 'number', icon: Calendar, placeholder: '25' },
  ];

  return (
    <div className="min-h-[calc(100vh-4rem)] flex">
      {/* Left - Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md slide-up">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center shadow-lg shadow-brand-500/25">
              <Feather className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold gradient-text">Blogger</span>
          </div>

          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            Create account
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mb-8">
            Join our community and start sharing your stories
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {fields.map((field) => (
              <div key={field.key} className="space-y-1.5">
                <label htmlFor={`register-${field.key}`} className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  {field.label}
                </label>
                <div className="relative">
                  <field.icon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    id={`register-${field.key}`}
                    type={field.type}
                    value={form[field.key]}
                    onChange={(e) => updateField(field.key, e.target.value)}
                    placeholder={field.placeholder}
                    min={field.type === 'number' ? '1' : undefined}
                    className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 
                      text-slate-900 dark:text-white placeholder-slate-400 
                      focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 
                      transition-all duration-300"
                  />
                </div>
              </div>
            ))}

            {/* Password */}
            <div className="space-y-1.5">
              <label htmlFor="register-password" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  id="register-password"
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={(e) => updateField('password', e.target.value)}
                  placeholder="Min. 6 characters"
                  className="w-full pl-11 pr-12 py-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 
                    text-slate-900 dark:text-white placeholder-slate-400 
                    focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 
                    transition-all duration-300"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {form.password && form.password.length < 6 && (
                <p className="text-xs text-red-500 mt-1">Password must be at least 6 characters</p>
              )}
            </div>

            {/* Submit */}
            <button
              id="register-submit-btn"
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl text-white font-semibold gradient-bg 
                hover:opacity-90 active:scale-[0.98] transition-all duration-300 
                shadow-lg shadow-brand-500/25 hover:shadow-brand-500/40
                disabled:opacity-50 disabled:cursor-not-allowed
                flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full spin-slow" />
              ) : (
                <>
                  Create account
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>

      {/* Right - Decorative Panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden justify-center">
        <div className="absolute inset-0 gradient-bg opacity-90" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRoLTJ2LTJoMnYyem0wLTRoLTJ2LTJoMnYyem0tNC00aC0ydi0yaDJ2MnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-30" />
        
        <div className="relative z-10 flex flex-col justify-center items-center p-12 text-white">
          <div className="float">
            <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-8 shadow-2xl">
              <Feather className="w-10 h-10" />
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-4 text-center">Join Blogger</h1>
          <p className="text-lg text-white/80 text-center max-w-md leading-relaxed">
            Share your unique perspective with a vibrant community of writers and readers.
          </p>

          <div className="absolute top-20 right-10 w-32 h-32 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute bottom-20 left-10 w-48 h-48 rounded-full bg-white/5 blur-3xl" />
          <div className="absolute top-1/3 right-1/4 w-20 h-20 rounded-full bg-accent-500/20 blur-2xl" />
        </div>
      </div>
    </div>
  );
}
