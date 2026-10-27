import React, { useState } from 'react';
import { Compass, Sparkles, Bookmark, User, LogOut, Database, Cpu, Menu, X, Globe, Video, Github } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Badge } from './UI/Badge';

interface NavbarProps {
  activeTab: 'landing' | 'planner' | 'itinerary' | 'saved' | 'map';
  setActiveTab: (tab: 'landing' | 'planner' | 'saved' | 'itinerary' | 'map') => void;
  openAuthModal: () => void;
  openDemoVideoModal?: () => void;
  backendOnline: boolean;
  githubUrl?: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  openAuthModal,
  openDemoVideoModal,
  backendOnline,
  githubUrl = 'https://github.com/your-username/wanderwise-ai',
}) => {
  const { user, isDemoUser, isSupabaseLive, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-cyan-500/15 bg-navy-900/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div
            onClick={() => setActiveTab('landing')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-glow-cyan-sm group-hover:shadow-glow-cyan transition-all">
              <Compass className="w-6 h-6 text-navy-950 font-bold" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-cyan-300 bg-clip-text text-transparent">
                  WanderWise
                </span>
                <span className="text-xs px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-mono font-semibold border border-cyan-500/30">
                  AI
                </span>
              </div>
              <p className="text-[10px] text-slate-400 tracking-wider uppercase font-medium">Smart Travel Planner</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 bg-navy-850/60 p-1 rounded-xl border border-white/5">
            <button
              onClick={() => setActiveTab('landing')}
              className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'landing'
                  ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('planner')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'planner' || activeTab === 'itinerary'
                  ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              Plan Trip
            </button>
            <button
              onClick={() => setActiveTab('saved')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'saved'
                  ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <Bookmark className="w-3.5 h-3.5 text-blue-400" />
              Saved Trips
            </button>
            <button
              onClick={() => setActiveTab('map')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'map'
                  ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <Globe className="w-3.5 h-3.5 text-emerald-400" />
              Route Map
            </button>
          </nav>

          {/* System status + Auth controls */}
          <div className="hidden lg:flex items-center gap-2.5">
            {/* Demo Video button */}
            {openDemoVideoModal && (
              <button
                onClick={openDemoVideoModal}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-cyan-300 bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/30 transition-all shadow-glow-cyan-sm cursor-pointer"
                title="Watch Demo Video Walkthrough"
              >
                <Video className="w-3.5 h-3.5 text-cyan-400" />
                <span>Demo Video</span>
              </button>
            )}

            {/* GitHub Repo button */}
            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-lg bg-navy-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/60 transition-colors"
              title="View on GitHub"
            >
              <Github className="w-4 h-4" />
            </a>

            {/* Engine badge */}
            <div className="flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-full bg-navy-800/80 border border-slate-700/60 text-slate-300">
              <Cpu className="w-3 h-3 text-cyan-400" />
              <span>{backendOnline ? 'FastAPI AI Engine' : 'Client AI Engine'}</span>
              <span className={`w-1.5 h-1.5 rounded-full ${backendOnline ? 'bg-cyan-400 animate-pulse' : 'bg-amber-400'}`} />
            </div>

            {/* Supabase status badge */}
            <div className="flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-full bg-navy-800/80 border border-slate-700/60 text-slate-300">
              <Database className="w-3 h-3 text-emerald-400" />
              <span>{isSupabaseLive ? 'Supabase Live' : 'Demo Mode'}</span>
            </div>

            {/* User profile / Login */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 pr-3 rounded-full bg-navy-800 border border-cyan-500/25 hover:border-cyan-500/50 transition-all"
                >
                  <img
                    src={user.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'}
                    alt="User Avatar"
                    className="w-7 h-7 rounded-full object-cover border border-cyan-400"
                  />
                  <span className="text-xs font-semibold text-slate-200 max-w-[100px] truncate">
                    {user.fullName || user.email.split('@')[0]}
                  </span>
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-xl bg-navy-800 border border-cyan-500/25 shadow-2xl p-2 z-50 animate-fade-in">
                    <div className="px-3 py-2 border-b border-slate-700/60">
                      <p className="text-xs font-semibold text-white">{user.fullName || 'Adventurer'}</p>
                      <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
                      {isDemoUser && (
                        <Badge variant="cyan" size="sm" className="mt-1">
                          Demo Account
                        </Badge>
                      )}
                    </div>
                    <button
                      onClick={() => {
                        setActiveTab('saved');
                        setUserDropdownOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 text-xs font-medium text-slate-300 hover:text-white hover:bg-navy-700 rounded-lg transition-colors flex items-center gap-2 mt-1"
                    >
                      <Bookmark className="w-3.5 h-3.5 text-cyan-400" />
                      View Saved Trips
                    </button>
                    <button
                      onClick={() => {
                        openAuthModal();
                        setUserDropdownOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 text-xs font-medium text-slate-300 hover:text-white hover:bg-navy-700 rounded-lg transition-colors flex items-center gap-2"
                    >
                      <User className="w-3.5 h-3.5 text-blue-400" />
                      Account Settings / Switch
                    </button>
                    <button
                      onClick={() => {
                        signOut();
                        setUserDropdownOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 text-xs font-medium text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors flex items-center gap-2 mt-1 border-t border-slate-700/60"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={openAuthModal}
                className="px-4 py-1.5 rounded-lg text-xs font-semibold text-navy-950 bg-gradient-to-r from-cyan-400 to-cyan-300 hover:from-cyan-300 hover:to-cyan-200 transition-all shadow-glow-cyan-sm"
              >
                Sign In
              </button>
            )}
          </div>

          {/* Mobile menu trigger */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-400 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-cyan-500/20 bg-navy-950/95 backdrop-blur-xl px-4 pt-3 pb-6 space-y-3">
          <button
            onClick={() => {
              setActiveTab('landing');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left py-2 text-sm font-medium text-slate-200 hover:text-cyan-400"
          >
            Overview
          </button>
          <button
            onClick={() => {
              setActiveTab('planner');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left py-2 text-sm font-medium text-cyan-400 flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            Plan Trip
          </button>
          <button
            onClick={() => {
              setActiveTab('saved');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left py-2 text-sm font-medium text-slate-200 hover:text-cyan-400 flex items-center gap-2"
          >
            <Bookmark className="w-4 h-4" />
            My Saved Trips
          </button>
          <button
            onClick={() => {
              setActiveTab('map');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left py-2 text-sm font-medium text-slate-200 hover:text-cyan-400 flex items-center gap-2"
          >
            <Globe className="w-4 h-4" />
            Route Map
          </button>

          {openDemoVideoModal && (
            <button
              onClick={() => {
                openDemoVideoModal();
                setMobileMenuOpen(false);
              }}
              className="w-full text-left py-2 text-sm font-medium text-cyan-300 hover:text-cyan-200 flex items-center gap-2"
            >
              <Video className="w-4 h-4 text-cyan-400" />
              Watch Demo Video
            </button>
          )}

          <a
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-2 text-sm font-medium text-slate-300 hover:text-white flex items-center gap-2"
          >
            <Github className="w-4 h-4 text-slate-400" />
            GitHub Repository
          </a>

          <div className="pt-3 border-t border-slate-800 flex flex-col gap-2">
            <div className="text-xs text-slate-400">
              Backend: {backendOnline ? 'FastAPI Live' : 'Client Mode'} | DB: {isSupabaseLive ? 'Supabase Live' : 'Demo Storage'}
            </div>
            {user ? (
              <button
                onClick={() => {
                  signOut();
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2 text-xs font-semibold text-rose-400 text-left"
              >
                Sign Out ({user.email})
              </button>
            ) : (
              <button
                onClick={() => {
                  openAuthModal();
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2 text-xs font-semibold text-cyan-400 text-left"
              >
                Sign In / Switch Account
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
