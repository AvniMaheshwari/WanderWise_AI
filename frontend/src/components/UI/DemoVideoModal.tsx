import React from 'react';
import { X, Play, ExternalLink, Video, Sparkles, CheckCircle2 } from 'lucide-react';

interface DemoVideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoUrl?: string;
  githubUrl?: string;
}

export const DemoVideoModal: React.FC<DemoVideoModalProps> = ({
  isOpen,
  onClose,
  videoUrl = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', // Default or user video
  githubUrl = 'https://github.com/your-username/wanderwise-ai',
}) => {
  if (!isOpen) return null;

  // Convert YouTube watch URL to embed URL if needed
  const getEmbedUrl = (url: string) => {
    if (url.includes('youtube.com/watch?v=')) {
      return url.replace('watch?v=', 'embed/');
    }
    if (url.includes('youtu.be/')) {
      const id = url.split('youtu.be/')[1]?.split('?')[0];
      return `https://www.youtube.com/embed/${id}`;
    }
    if (url.includes('loom.com/share/')) {
      return url.replace('/share/', '/embed/');
    }
    return url;
  };

  const embedUrl = getEmbedUrl(videoUrl);

  const demoChapters = [
    { time: '0:00 - 0:35', title: 'Problem & SaaS Architecture Overview', desc: 'Midnight & cyan UI, React 18, FastAPI & Supabase' },
    { time: '0:35 - 1:15', title: 'AI Trip Builder in Action', desc: 'Destination presets, budget constraints & travel styles' },
    { time: '1:15 - 1:50', title: 'Selective Day Regeneration', desc: 'Regenerating Day 2 with targeted street food prompt' },
    { time: '1:50 - 2:25', title: 'Interactive Map & Budget Math', desc: 'GPS route corridors and over-budget validation' },
    { time: '2:25 - 3:00', title: 'Supabase Auth & Saved Trips', desc: 'PostgreSQL Row Level Security and profile persistence' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/85 backdrop-blur-md p-4 overflow-y-auto">
      <div className="glass-panel w-full max-w-4xl rounded-2xl border border-cyan-500/30 p-6 sm:p-7 shadow-2xl relative animate-fade-in text-left max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-700/60 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Video className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg sm:text-xl font-bold text-white">WanderWise AI — Product Walkthrough</h3>
                <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                  Demo Video
                </span>
              </div>
              <p className="text-xs text-slate-400">Comprehensive full-stack feature demonstration & architecture review</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video Player Container */}
        <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-navy-950 border border-slate-700/80 mb-6 shadow-glow-card">
          <iframe
            src={embedUrl}
            title="WanderWise AI Demo Walkthrough"
            className="w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>

        {/* Quick Link Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl bg-navy-850/80 border border-slate-700/60 mb-6">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-semibold text-slate-200">Ready to clone or customize the repository?</span>
          </div>
          <div className="flex items-center gap-2.5">
            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 border border-slate-600 transition-colors inline-flex items-center gap-1.5"
            >
              <span>View GitHub Repo</span>
              <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
            </a>
            <a
              href={videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-xl text-xs font-bold text-navy-950 bg-gradient-to-r from-cyan-400 to-cyan-300 hover:from-cyan-300 transition-all shadow-glow-cyan-sm inline-flex items-center gap-1.5"
            >
              <Play className="w-3.5 h-3.5 fill-navy-950" />
              <span>Watch on YouTube / Loom</span>
            </a>
          </div>
        </div>

        {/* Presentation Walkthrough Agenda */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> Video Agenda & Key Milestones
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
            {demoChapters.map((ch, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-navy-850/50 border border-slate-700/40 text-left">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-mono font-bold text-cyan-400 bg-cyan-500/10 px-1.5 py-0.5 rounded">
                    {ch.time}
                  </span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-slate-500" />
                </div>
                <h5 className="text-xs font-bold text-white mb-0.5">{ch.title}</h5>
                <p className="text-[11px] text-slate-400 leading-snug">{ch.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
