import React from 'react';
import { Building2, Star, Check } from 'lucide-react';
import { AccommodationSuggestion } from '../../types/itinerary';

interface AccommodationCardProps {
  accommodation: AccommodationSuggestion;
}

export const AccommodationCard: React.FC<AccommodationCardProps> = ({ accommodation }) => {
  return (
    <div className="p-3.5 rounded-xl bg-navy-850/70 border border-slate-700/60 text-left">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5 text-cyan-400">
          <Building2 className="w-4 h-4" />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Suggested Stay
          </span>
        </div>
        <div className="flex items-center gap-1 bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded text-xs font-semibold">
          <Star className="w-3 h-3 fill-amber-400" />
          <span>{accommodation.rating}</span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
        <h5 className="text-sm font-bold text-white">{accommodation.name}</h5>
        <span className="text-xs font-mono font-semibold text-emerald-400">
          ${accommodation.pricePerNight} <span className="text-[10px] text-slate-400">/ night</span>
        </span>
      </div>

      <p className="text-xs text-slate-400 mb-2">
        {accommodation.type} • {accommodation.neighborhood}
      </p>

      {accommodation.highlights && accommodation.highlights.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {accommodation.highlights.map((h, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700"
            >
              <Check className="w-2.5 h-2.5 text-cyan-400" />
              {h}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};
