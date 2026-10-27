import React from 'react';
import { Clock, MapPin, DollarSign, Edit2, Trash2, AlertCircle, Info } from 'lucide-react';
import { Activity } from '../../types/itinerary';
import { Badge } from '../UI/Badge';

interface ActivityItemProps {
  activity: Activity;
  onEdit: (activity: Activity) => void;
  onDelete: (activityId: string) => void;
}

export const ActivityItem: React.FC<ActivityItemProps> = ({
  activity,
  onEdit,
  onDelete,
}) => {
  const periodColors = {
    morning: 'border-l-amber-400',
    afternoon: 'border-l-cyan-400',
    evening: 'border-l-indigo-400',
  };

  const categoryVariants: Record<string, 'cyan' | 'blue' | 'purple' | 'emerald' | 'amber' | 'slate'> = {
    Sightseeing: 'cyan',
    Cultural: 'purple',
    Adventure: 'emerald',
    Food: 'amber',
    Relaxation: 'blue',
    Shopping: 'cyan',
    Nature: 'emerald',
    Entertainment: 'purple',
  };

  return (
    <div
      className={`relative p-4 rounded-xl bg-navy-850/90 border border-slate-700/60 hover:border-cyan-500/30 transition-all border-l-4 ${
        periodColors[activity.period] || 'border-l-cyan-400'
      } group`}
    >
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-2">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-mono font-bold text-cyan-300 flex items-center gap-1 bg-cyan-500/10 px-2 py-0.5 rounded">
            <Clock className="w-3 h-3" />
            {activity.time}
          </span>
          <span className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">
            ({activity.period})
          </span>
          <Badge
            variant={categoryVariants[activity.category] || 'slate'}
            size="sm"
          >
            {activity.category}
          </Badge>
          {activity.bookingRequired && (
            <span className="text-[11px] px-2 py-0.5 rounded bg-amber-500/15 text-amber-300 border border-amber-500/30 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" /> Booking Needed
            </span>
          )}
        </div>

        {/* Cost & Actions */}
        <div className="flex items-center gap-3 self-end sm:self-start">
          <span className="text-xs font-mono font-semibold text-emerald-400">
            {activity.cost === 0 ? 'Free' : `$${activity.cost}`}
          </span>
          <div className="flex items-center gap-1 opacity-70 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => onEdit(activity)}
              title="Edit Activity"
              className="p-1 rounded text-slate-400 hover:text-cyan-400 hover:bg-slate-800 transition-colors"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onDelete(activity.id)}
              title="Remove Activity"
              className="p-1 rounded text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      <h4 className="text-sm font-bold text-white mb-1.5">{activity.title}</h4>
      <p className="text-xs text-slate-300 leading-relaxed mb-3">
        {activity.description}
      </p>

      {/* Meta info footer */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400 pt-2 border-t border-slate-800">
        <span className="flex items-center gap-1">
          <MapPin className="w-3 h-3 text-cyan-400" />
          {activity.location}
        </span>
        <span className="flex items-center gap-1 font-mono text-[11px]">
          Duration: {activity.duration}
        </span>
        {activity.tips && (
          <span className="flex items-center gap-1 text-[11px] text-cyan-300/90 italic">
            <Info className="w-3 h-3" /> {activity.tips}
          </span>
        )}
      </div>
    </div>
  );
};
