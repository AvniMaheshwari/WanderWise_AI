import React from 'react';
import { Sparkles, ArrowRight, Compass, ShieldCheck, MapPin, Calendar, DollarSign, Users, Video } from 'lucide-react';
import { Badge } from './UI/Badge';

interface HeroSectionProps {
  onStartPlanning: (presetDestination?: string) => void;
  onPreviewSampleTrip: () => void;
  onOpenDemoVideo?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onStartPlanning,
  onPreviewSampleTrip,
  onOpenDemoVideo,
}) => {
  const quickDestinations = [
    { name: 'Kyoto, Japan', emoji: '⛩️' },
    { name: 'Paris, France', emoji: '🗼' },
    { name: 'Rome, Italy', emoji: '🏛️' },
    { name: 'Reykjavik, Iceland', emoji: '🌋' },
    { name: 'Tokyo, Japan', emoji: '🏮' },
  ];

  return (
    <section className="relative pt-12 pb-20 md:pt-20 md:pb-28 overflow-hidden">
      {/* Glow Orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-cyan-500/10 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute top-1/3 left-1/4 w-[300px] h-[200px] bg-blue-600/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        {/* Release Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold mb-6 shadow-glow-cyan-sm">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
          <span>Next-Gen Travel Intelligence • Pydantic AI Validation & Supabase RLS</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-[1.12]">
          Intelligent Journeys.{' '}
          <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-400 bg-clip-text text-transparent">
            Precision Timed.
          </span>
          <br className="hidden sm:inline" /> Perfectly Tailored.
        </h1>

        {/* Subhead */}
        <p className="mt-6 text-base sm:text-lg md:text-xl text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
          WanderWise AI designs complete, personalized travel itineraries in seconds — with day-by-day schedules, geocoded route maps, local cuisine picks, and real-time expense validation.
        </p>

        {/* CTAs */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => onStartPlanning()}
            className="w-full sm:w-auto px-7 py-3.5 rounded-xl font-bold text-sm text-navy-950 bg-gradient-to-r from-cyan-400 to-cyan-300 hover:from-cyan-300 hover:to-cyan-200 transition-all shadow-glow-cyan flex items-center justify-center gap-2 group cursor-pointer"
          >
            <Sparkles className="w-4 h-4 group-hover:rotate-12 transition-transform" />
            <span>Start Planning with AI</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>

          {onOpenDemoVideo && (
            <button
              onClick={onOpenDemoVideo}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-semibold text-sm text-cyan-300 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 transition-all shadow-glow-cyan-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              <Video className="w-4 h-4 text-cyan-400" />
              <span>Watch Demo Video</span>
            </button>
          )}

          <button
            onClick={onPreviewSampleTrip}
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-semibold text-sm text-slate-200 bg-navy-800/90 hover:bg-navy-750 border border-slate-700/80 hover:border-cyan-500/40 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Compass className="w-4 h-4 text-slate-400" />
            <span>Featured Kyoto Plan</span>
          </button>
        </div>

        {/* Quick destination chips */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-2 text-xs">
          <span className="text-slate-400 mr-1">Popular destinations:</span>
          {quickDestinations.map((d) => (
            <button
              key={d.name}
              onClick={() => onStartPlanning(d.name)}
              className="px-2.5 py-1 rounded-lg bg-navy-800/80 hover:bg-cyan-500/20 text-slate-300 hover:text-cyan-300 border border-white/5 hover:border-cyan-500/30 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <span>{d.emoji}</span>
              <span>{d.name}</span>
            </button>
          ))}
        </div>

        {/* Floating preview card */}
        <div className="mt-16 max-w-4xl mx-auto glass-panel rounded-2xl p-6 sm:p-8 border border-cyan-500/25 shadow-glow-card text-left relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-700/60">
            <div>
              <div className="flex items-center gap-2">
                <Badge variant="cyan" size="sm">Featured Sample</Badge>
                <span className="text-xs text-slate-400 font-mono">ID: kyoto-autumn-2026</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white mt-1">
                Kyoto Cultural & Culinary Discovery
              </h3>
              <p className="text-xs text-slate-400 mt-1 flex items-center gap-3">
                <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-cyan-400" /> Kyoto, Japan</span>
                <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-blue-400" /> 4 Days</span>
                <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5 text-purple-400" /> 2 Travelers</span>
              </p>
            </div>

            <div className="text-right sm:self-center">
              <span className="text-xs text-slate-400 uppercase tracking-wider block">Estimated Budget</span>
              <span className="text-2xl font-extrabold text-cyan-400 font-mono">$2,600</span>
              <span className="text-[11px] text-emerald-400 block font-medium">✓ Within $2,800 limit</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 text-xs text-slate-300">
            <div className="p-3.5 rounded-xl bg-navy-850/80 border border-white/5">
              <div className="font-semibold text-white mb-1 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-cyan-400" /> Day 1 • Historic Gion & Shrines
              </div>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Fushimi Inari gates at dawn, Kiyomizu-dera wooden terrace, Uji matcha ceremony, and lantern-lit Shirakawa.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-navy-850/80 border border-white/5">
              <div className="font-semibold text-white mb-1 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-400" /> Day 2 • Arashiyama Bamboo
              </div>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Sagano bamboo grove, Tenryu-ji Zen UNESCO garden, Okochi Sanso tea villa, and sunset at Togetsukyo bridge.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-navy-850/80 border border-white/5">
              <div className="font-semibold text-white mb-1 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400" /> Day 3 • Nishiki Gastronomy
              </div>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Kinkaku-ji Golden Pavilion, Ryoan-ji rock meditation, Nishiki Market street food crawl, and Pontocho Izakayas.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
