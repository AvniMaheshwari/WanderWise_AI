import React from 'react';
import { Calendar, RefreshCw, Plus, DollarSign, Sparkles } from 'lucide-react';
import { DayItinerary, Activity } from '../../types/itinerary';
import { ActivityItem } from './ActivityItem';
import { MealSection } from './MealSection';
import { AccommodationCard } from './AccommodationCard';
import { TransportCard } from './TransportCard';

interface DayCardProps {
  day: DayItinerary;
  destination: string;
  onEditActivity: (activity: Activity, dayNumber: number) => void;
  onDeleteActivity: (activityId: string, dayNumber: number) => void;
  onAddActivity: (dayNumber: number) => void;
  onOpenRegenerate: (dayNumber: number) => void;
  isRegeneratingThisDay: boolean;
}

export const DayCard: React.FC<DayCardProps> = ({
  day,
  destination,
  onEditActivity,
  onDeleteActivity,
  onAddActivity,
  onOpenRegenerate,
  isRegeneratingThisDay,
}) => {
  return (
    <div className="glass-panel rounded-2xl border border-slate-700/60 p-5 sm:p-7 mb-8 relative overflow-hidden transition-all shadow-glow-card">
      {/* Glow highlight */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 opacity-60" />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-700/60">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-3 py-1 rounded-lg bg-cyan-500/20 text-cyan-300 font-extrabold text-sm border border-cyan-500/30">
              Day {day.dayNumber}
            </span>
            <span className="text-xs text-slate-400 flex items-center gap-1 font-mono">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              {day.date}
            </span>
            <span className="text-xs px-2 py-0.5 rounded bg-navy-800 text-emerald-400 font-mono font-semibold border border-emerald-500/30">
              Est. Day Cost: ${day.dayCost}
            </span>
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-white mt-1">
            {day.theme}
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
            {day.summary}
          </p>
        </div>

        {/* Day Actions */}
        <div className="flex items-center gap-2 self-start md:self-center">
          <button
            onClick={() => onAddActivity(day.dayNumber)}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-300 bg-navy-850 hover:bg-navy-800 border border-slate-700 hover:border-cyan-500/40 transition-colors flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5 text-cyan-400" />
            Add Activity
          </button>

          <button
            onClick={() => onOpenRegenerate(day.dayNumber)}
            disabled={isRegeneratingThisDay}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold text-cyan-300 bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/40 transition-all flex items-center gap-1.5 shadow-sm disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRegeneratingThisDay ? 'animate-spin' : ''}`} />
            <span>{isRegeneratingThisDay ? 'Regenerating...' : 'Regenerate Day'}</span>
          </button>
        </div>
      </div>

      {/* Activities Timeline */}
      <div className="my-6">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400" />
          Scheduled Experiences & Routing
        </h4>

        {day.activities.length === 0 ? (
          <div className="p-6 rounded-xl bg-navy-850/50 border border-dashed border-slate-700 text-center text-xs text-slate-400">
            No activities scheduled for this day yet. Click "Add Activity" above.
          </div>
        ) : (
          <div className="space-y-3">
            {day.activities.map((act) => (
              <ActivityItem
                key={act.id}
                activity={act}
                onEdit={(a) => onEditActivity(a, day.dayNumber)}
                onDelete={(id) => onDeleteActivity(id, day.dayNumber)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Dining Section */}
      <MealSection meals={day.meals} />

      {/* Stay & Transit Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-4 border-t border-slate-800">
        <AccommodationCard accommodation={day.accommodation} />
        <TransportCard transport={day.transport} />
      </div>
    </div>
  );
};
