import React from 'react';
import { Sparkles, RefreshCw, DollarSign, Map, ShieldCheck, Edit3, Compass, Clock } from 'lucide-react';

export const FeatureGrid: React.FC = () => {
  const features = [
    {
      icon: Sparkles,
      title: 'Generative AI Itinerary Engine',
      description: 'Structured daily agendas with realistic timings, travel times, local meal choices, and accommodation tailored to your travel style.',
      badge: 'FastAPI + Pydantic',
    },
    {
      icon: RefreshCw,
      title: 'Selective Day Regeneration',
      description: 'Dislike a specific day? Regenerate only Day 2 or Day 4 with custom prompt instructions without resetting the rest of your trip.',
      badge: 'Granular AI Controls',
    },
    {
      icon: DollarSign,
      title: 'Real-Time Budget Validation',
      description: 'Granular expense breakdown across lodging, food, activities, and transport with instant budget compliance alerts.',
      badge: 'Expense Intelligence',
    },
    {
      icon: Map,
      title: 'Interactive Leaflet Route Maps',
      description: 'Real geocoded coordinates plotted on high-contrast dark maps with day filters, numbered pins, and popup activity summaries.',
      badge: 'Geo-Enabled',
    },
    {
      icon: Edit3,
      title: 'Activity Customizer & Reordering',
      description: 'Easily edit activity times, costs, descriptions, add custom stops, or delete items to shape your dream itinerary.',
      badge: 'Full Flexibility',
    },
    {
      icon: ShieldCheck,
      title: 'Supabase Auth & Row Level Security',
      description: 'User accounts, encrypted sessions, and isolated per-user trip persistence governed by PostgreSQL RLS policies.',
      badge: 'Production Security',
    },
  ];

  return (
    <section className="py-16 md:py-24 border-t border-cyan-500/15 bg-navy-900/60 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 font-mono">
            Full-Stack Intelligence
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2">
            Engineered for Effortless Exploration
          </h2>
          <p className="text-slate-400 text-sm sm:text-base mt-3">
            Every layer from backend API validation to reactive state management is built for speed, precision, and delight.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div
                key={idx}
                className="glass-panel p-6 rounded-2xl border border-slate-700/60 hover:border-cyan-500/40 transition-all hover:-translate-y-1 group"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 group-hover:bg-cyan-500/20 group-hover:shadow-glow-cyan-sm transition-all">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-[11px] font-mono font-medium px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                    {feat.badge}
                  </span>
                </div>
                <h3 className="text-base font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors">
                  {feat.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                  {feat.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
