import React from 'react';
import { Bus, Clock, DollarSign } from 'lucide-react';
import { TransportOption } from '../../types/itinerary';

interface TransportCardProps {
  transport: TransportOption;
}

export const TransportCard: React.FC<TransportCardProps> = ({ transport }) => {
  return (
    <div className="p-3.5 rounded-xl bg-navy-850/70 border border-slate-700/60 text-left">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5 text-blue-400">
          <Bus className="w-4 h-4" />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Daily Transit
          </span>
        </div>
        <span className="text-xs font-mono font-semibold text-emerald-400">
          ~${transport.estimatedCost}
        </span>
      </div>

      <h5 className="text-sm font-bold text-white mb-1">{transport.mode}</h5>
      <p className="text-xs text-slate-400 mb-2 leading-relaxed">{transport.description}</p>

      <div className="flex items-center gap-1.5 text-[11px] text-cyan-300 font-mono">
        <Clock className="w-3 h-3 text-cyan-400" />
        <span>Approx. {transport.duration}</span>
      </div>
    </div>
  );
};
