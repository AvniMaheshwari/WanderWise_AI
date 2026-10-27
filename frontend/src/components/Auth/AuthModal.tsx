import React, { useState } from 'react';
import { X, Lock, Mail, User, ShieldCheck, Sparkles, Check, KeyRound } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Badge } from '../UI/Badge';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { signIn, signUp, loginAsDemo, isSupabaseLive } = useAuth();
  const [tab, setTab] = useState<'signin' | 'signup' | 'demo'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      if (tab === 'signup') {
        const res = await signUp(email, password, fullName);
        if (res.error) {
          setErrorMsg(res.error);
        } else {
          onSuccess?.();
          onClose();
        }
      } else {
        const res = await signIn(email, password);
        if (res.error) {
          setErrorMsg(res.error);
        } else {
          onSuccess?.();
          onClose();
        }
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = () => {
    loginAsDemo();
    onSuccess?.();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/80 backdrop-blur-md p-4 overflow-y-auto">
      <div className="glass-panel w-full max-w-md rounded-2xl border border-cyan-500/30 p-6 sm:p-7 shadow-2xl relative animate-fade-in text-left">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-700/60 mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white">
                {isSupabaseLive ? 'Supabase Authentication' : 'Account Access'}
              </h3>
              <p className="text-xs text-slate-400">
                {isSupabaseLive ? 'Row Level Security Protected' : 'Instant Demo / Live Mode'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex rounded-xl bg-navy-850 p-1 mb-5 border border-slate-700/60">
          <button
            onClick={() => setTab('signin')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              tab === 'signin'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => setTab('signup')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              tab === 'signup'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Sign Up
          </button>
          <button
            onClick={() => setTab('demo')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              tab === 'demo'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Demo Access
          </button>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs">
            {errorMsg}
          </div>
        )}

        {tab === 'demo' ? (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-xs text-slate-300 space-y-2">
              <div className="flex items-center gap-2 font-semibold text-cyan-300">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                Portfolio Reviewer Instant Access
              </div>
              <p className="text-[11px] leading-relaxed text-slate-300">
                You can explore full trip generation, budget validation, and local persistence without needing a Supabase account or external credentials.
              </p>
              <div className="text-[10px] text-slate-400 pt-1 border-t border-cyan-500/20">
                Demo User: <code className="text-cyan-300 font-mono">alex.wanderer@example.com</code>
              </div>
            </div>

            <button
              onClick={handleDemoLogin}
              className="w-full py-2.5 rounded-xl font-bold text-xs text-navy-950 bg-gradient-to-r from-cyan-400 to-cyan-300 hover:from-cyan-300 transition-all shadow-glow-cyan flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Continue as Alex Vance (Demo)</span>
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {tab === 'signup' && (
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-slate-400" /> Full Name
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Alex Vance"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-navy-850 border border-slate-700 focus:border-cyan-400 text-xs sm:text-sm text-white outline-none"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-400" /> Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="traveler@wanderwise.ai"
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-navy-850 border border-slate-700 focus:border-cyan-400 text-xs sm:text-sm text-white outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-slate-400" /> Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
                className="w-full px-3.5 py-2.5 rounded-xl bg-navy-850 border border-slate-700 focus:border-cyan-400 text-xs sm:text-sm text-white outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-2.5 rounded-xl font-bold text-xs text-navy-950 bg-gradient-to-r from-cyan-400 to-cyan-300 hover:from-cyan-300 transition-all shadow-glow-cyan flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>{loading ? 'Authenticating...' : tab === 'signup' ? 'Create Account' : 'Sign In'}</span>
            </button>
          </form>
        )}

        <div className="mt-5 pt-4 border-t border-slate-700/60 text-center">
          <p className="text-[11px] text-slate-500">
            {isSupabaseLive
              ? '✓ Connected to live Supabase Auth & PostgreSQL RLS'
              : '⚡ Running in Instant Demo Mode — Add VITE_SUPABASE_URL for live Supabase sync'}
          </p>
        </div>
      </div>
    </div>
  );
};
