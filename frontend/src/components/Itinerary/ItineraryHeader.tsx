import React from 'react';
import {
  MapPin,
  Calendar,
  Users,
  Bookmark,
  Share2,
  Printer,
  Sliders,
  Map,
  Sparkles,
  Check,
} from 'lucide-react';
import { Trip } from '../../types/itinerary';
import { Badge } from '../UI/Badge';

interface ItineraryHeaderProps {
  trip: Trip;
  onSaveTrip: () => void;
  isSaving: boolean;
  onEditPreferences: () => void;
  onOpenMap: () => void;
  selectedDayTab: number | 'all';
  setSelectedDayTab: (tab: number | 'all') => void;
}

export const ItineraryHeader: React.FC<ItineraryHeaderProps> = ({
  trip,
  onSaveTrip,
  isSaving,
  onEditPreferences,
  onOpenMap,
  selectedDayTab,
  setSelectedDayTab,
}) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="glass-panel rounded-2xl border border-cyan-500/25 p-6 sm:p-8 mb-8 relative overflow-hidden shadow-glow-card text-left">
      {/* Background ambient cover */}
      <div
        className="absolute inset-0 opacity-15 bg-cover bg-center pointer-events-none"
        style={{ backgroundImage: `url(${trip.coverImage})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-navy-950 via-navy-900/95 to-navy-950/90 pointer-events-none" />

      <div className="relative z-10">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="cyan" size="sm">
                AI Structured Itinerary
              </Badge>
              <Badge variant="blue" size="sm">
                {trip.pace.toUpperCase()} PACE
              </Badge>
              <Badge variant="purple" size="sm">
                {trip.travelStyle.toUpperCase()}
              </Badge>
              {trip.isSaved && (
                <span className="inline-flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  <Check className="w-3 h-3" /> Saved to Supabase
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight">
              {trip.title}
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl">
              {trip.overview}
            </p>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-1">
              <span className="flex items-center gap-1.5 text-cyan-300 font-medium">
                <MapPin className="w-4 h-4 text-cyan-400" />
                {trip.destination}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-blue-400" />
                {trip.startDate} to {trip.endDate} ({trip.durationDays} Days)
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Users className="w-4 h-4 text-purple-400" />
                {trip.travelers} Traveler(s)
              </span>
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="flex flex-wrap lg:flex-col items-stretch gap-2.5 shrink-0 self-start">
            <button
              onClick={onSaveTrip}
              disabled={isSaving}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-glow-cyan-sm flex items-center justify-center gap-2 cursor-pointer ${
                trip.isSaved
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30'
                  : 'text-navy-950 bg-gradient-to-r from-cyan-400 to-cyan-300 hover:from-cyan-300'
              }`}
            >
              <Bookmark className="w-4 h-4" />
              <span>{isSaving ? 'Saving to Database...' : trip.isSaved ? 'Update Saved Trip' : 'Save Trip to Supabase'}</span>
            </button>

            <button
              onClick={onOpenMap}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-200 bg-navy-800 hover:bg-navy-750 border border-slate-700 hover:border-cyan-500/40 transition-colors flex items-center justify-center gap-2"
            >
              <Map className="w-3.5 h-3.5 text-cyan-400" />
              <span>Interactive Route Map</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={onEditPreferences}
                className="flex-1 px-3 py-2 rounded-xl text-xs font-medium text-slate-300 bg-navy-850 hover:bg-navy-800 border border-slate-700/80 transition-colors flex items-center justify-center gap-1.5"
                title="Modify trip dates, budget & style"
              >
                <Sliders className="w-3.5 h-3.5 text-slate-400" />
                <span>Preferences</span>
              </button>

              <button
                onClick={handlePrint}
                className="px-3 py-2 rounded-xl text-xs font-medium text-slate-300 bg-navy-850 hover:bg-navy-800 border border-slate-700/80 transition-colors flex items-center justify-center gap-1.5"
                title="Print or export itinerary"
              >
                <Printer className="w-3.5 h-3.5 text-slate-400" />
                <span>Print</span>
              </button>
            </div>
          </div>
        </div>

        {/* Day selection tabs */}
        <div className="mt-8 pt-5 border-t border-slate-700/60 flex items-center gap-2 overflow-x-auto pb-1">
          <span className="text-xs font-semibold text-slate-400 mr-2 shrink-0">View:</span>
          <button
            onClick={() => setSelectedDayTab('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shrink-0 ${
              selectedDayTab === 'all'
                ? 'bg-cyan-400 text-navy-950 shadow-glow-cyan-sm'
                : 'bg-navy-850 text-slate-300 border border-slate-700 hover:border-slate-500'
            }`}
          >
            All Days ({trip.days.length})
          </button>
          {trip.days.map((day) => (
            <button
              key={day.dayNumber}
              onClick={() => setSelectedDayTab(day.dayNumber)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shrink-0 ${
                selectedDayTab === day.dayNumber
                  ? 'bg-cyan-400 text-navy-950 shadow-glow-cyan-sm'
                  : 'bg-navy-850 text-slate-300 border border-slate-700 hover:border-slate-500'
              }`}
            >
              Day {day.dayNumber}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
