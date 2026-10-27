import React, { useState } from 'react';
import {
  Bookmark,
  Calendar,
  MapPin,
  Trash2,
  ExternalLink,
  Plus,
  Sparkles,
  Search,
  DollarSign,
  Users,
} from 'lucide-react';
import { Trip } from '../../types/itinerary';
import { Badge } from '../UI/Badge';

interface DashboardViewProps {
  trips: Trip[];
  onSelectTrip: (trip: Trip) => void;
  onDeleteTrip: (tripId: string) => void;
  onNewTrip: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  trips,
  onSelectTrip,
  onDeleteTrip,
  onNewTrip,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTrips = trips.filter(
    (t) =>
      t.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalDestinations = new Set(trips.map((t) => t.destination)).size;
  const totalBudgetSpent = trips.reduce((sum, t) => sum + (t.expenses?.total || 0), 0);

  return (
    <div className="py-8 text-left max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header and Stats */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Bookmark className="w-5 h-5 text-cyan-400" />
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Saved Trips & Itineraries</h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-400">
            Stored in Supabase PostgreSQL with user-level Row Level Security isolation
          </p>
        </div>

        <button
          onClick={onNewTrip}
          className="px-5 py-2.5 rounded-xl font-bold text-xs text-navy-950 bg-gradient-to-r from-cyan-400 to-cyan-300 hover:from-cyan-300 transition-all shadow-glow-cyan flex items-center gap-2 self-start md:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Plan New Trip</span>
        </button>
      </div>

      {/* Stats Counter Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="glass-panel p-4 rounded-xl border border-slate-700/60">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
            Saved Itineraries
          </span>
          <span className="text-2xl font-extrabold text-white font-mono mt-1 block">
            {trips.length}
          </span>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-slate-700/60">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
            Unique Destinations
          </span>
          <span className="text-2xl font-extrabold text-cyan-400 font-mono mt-1 block">
            {totalDestinations}
          </span>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-slate-700/60">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
            Cumulative Itinerary Budget
          </span>
          <span className="text-2xl font-extrabold text-emerald-400 font-mono mt-1 block">
            ${totalBudgetSpent.toLocaleString()} USD
          </span>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative mb-6 max-w-md">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Filter by destination or trip title..."
          className="w-full pl-10 pr-4 py-2 rounded-xl bg-navy-850 border border-slate-700 focus:border-cyan-400 text-xs sm:text-sm text-white outline-none"
        />
      </div>

      {/* Trips Grid */}
      {filteredTrips.length === 0 ? (
        <div className="glass-panel rounded-2xl border border-dashed border-slate-700 p-12 text-center max-w-md mx-auto">
          <Sparkles className="w-10 h-10 text-cyan-400 mx-auto mb-3 opacity-60" />
          <h4 className="text-base font-bold text-white mb-1">No Saved Trips Found</h4>
          <p className="text-xs text-slate-400 mb-5 leading-relaxed">
            {searchTerm
              ? `No itineraries matching "${searchTerm}". Try a different search.`
              : 'You haven’t saved any trips yet. Generate an itinerary to begin!'}
          </p>
          <button
            onClick={onNewTrip}
            className="px-4 py-2 rounded-xl font-semibold text-xs text-navy-950 bg-cyan-400 hover:bg-cyan-300 transition-colors inline-flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            Create Trip
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTrips.map((trip) => {
            const totalActivities = trip.days.reduce((acc, d) => acc + d.activities.length, 0);

            return (
              <div
                key={trip.id}
                className="glass-panel rounded-2xl border border-slate-700/60 hover:border-cyan-500/40 transition-all flex flex-col justify-between overflow-hidden group hover:-translate-y-1"
              >
                {/* Thumbnail */}
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={trip.coverImage}
                    alt={trip.destination}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-transparent to-transparent" />
                  <div className="absolute top-3 left-3">
                    <Badge variant="cyan" size="sm">
                      {trip.durationDays} Days
                    </Badge>
                  </div>
                  <div className="absolute top-3 right-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteTrip(trip.id);
                      }}
                      title="Delete trip"
                      className="p-1.5 rounded-lg bg-navy-950/70 hover:bg-rose-500/30 text-slate-300 hover:text-rose-400 border border-white/10 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="absolute bottom-3 left-3 right-3">
                    <span className="text-[11px] text-cyan-300 font-semibold flex items-center gap-1 mb-0.5">
                      <MapPin className="w-3 h-3" />
                      {trip.destination}
                    </span>
                    <h3 className="text-base font-bold text-white truncate">
                      {trip.title}
                    </h3>
                  </div>
                </div>

                {/* Body */}
                <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {trip.overview}
                  </p>

                  <div className="pt-2 border-t border-slate-800 text-xs text-slate-400 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-blue-400" />
                        {trip.startDate}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3 text-purple-400" />
                        {trip.travelers} Traveler(s)
                      </span>
                    </div>

                    <div className="flex items-center justify-between font-mono">
                      <span>Total Budget:</span>
                      <span className="font-bold text-emerald-400">
                        ${trip.expenses?.total?.toLocaleString() || trip.budget.toLocaleString()} {trip.currency}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400 font-mono">
                      {totalActivities} experiences
                    </span>
                    <button
                      onClick={() => onSelectTrip(trip)}
                      className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-cyan-300 bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/30 transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>Open Plan</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
