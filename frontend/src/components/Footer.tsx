import React from 'react';
import { Compass, Github, Shield, Heart, Sparkles, Video, ExternalLink } from 'lucide-react';

interface FooterProps {
  onOpenDemoVideo?: () => void;
  githubUrl?: string;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenDemoVideo,
  githubUrl = 'https://github.com/your-username/wanderwise-ai',
}) => {
  return (
    <footer className="border-t border-cyan-500/15 bg-navy-950/90 text-slate-400 text-sm mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center">
                <Compass className="w-5 h-5 text-navy-950" />
              </div>
              <span className="text-lg font-bold text-white">WanderWise AI</span>
            </div>
            <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
              Autonomous, personalized travel itinerary planner engineered with Python FastAPI, React, Supabase PostgreSQL, and structured Generative AI intelligence.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                <Sparkles className="w-3 h-3" /> GenAI Structured Outputs
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded bg-blue-500/10 text-blue-300 border border-blue-500/20">
                <Shield className="w-3 h-3" /> Supabase RLS Security
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-3">Core Features & Media</h4>
            <ul className="space-y-2 text-xs">
              <li className="hover:text-cyan-400 cursor-pointer transition-colors">Smart Trip Builder</li>
              <li className="hover:text-cyan-400 cursor-pointer transition-colors">One-Click Day Regeneration</li>
              <li className="hover:text-cyan-400 cursor-pointer transition-colors">Budget Validation & Math</li>
              <li className="hover:text-cyan-400 cursor-pointer transition-colors">Interactive Geocoded Maps</li>
              {onOpenDemoVideo && (
                <li>
                  <button
                    onClick={onOpenDemoVideo}
                    className="text-cyan-400 hover:text-cyan-300 font-semibold inline-flex items-center gap-1.5 pt-1"
                  >
                    <Video className="w-3.5 h-3.5" />
                    <span>Watch Demo Video</span>
                  </button>
                </li>
              )}
              <li>
                <a
                  href={githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-300 hover:text-white inline-flex items-center gap-1.5"
                >
                  <Github className="w-3.5 h-3.5 text-cyan-400" />
                  <span>GitHub Repository</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Architecture */}
          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-3">Stack Architecture</h4>
            <ul className="space-y-1.5 text-xs text-slate-400">
              <li><span className="text-cyan-300 font-mono">React 18</span> + Vite + TypeScript</li>
              <li><span className="text-cyan-300 font-mono">Tailwind CSS</span> (Midnight & Cyan)</li>
              <li><span className="text-cyan-300 font-mono">FastAPI</span> + Pydantic v2</li>
              <li><span className="text-cyan-300 font-mono">Supabase</span> Auth + PostgreSQL RLS</li>
              <li><span className="text-cyan-300 font-mono">Leaflet</span> OpenStreetMap Geo</li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p className="flex items-center gap-1 text-slate-500">
            Engineered with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" /> for modern global travelers.
          </p>
          <div className="flex items-center gap-4 text-slate-500">
            <span>Portfolio Edition</span>
            <span>•</span>
            <span className="text-cyan-400 font-mono">v1.0.0</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
