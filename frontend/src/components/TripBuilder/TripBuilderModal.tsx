import React, { useState } from 'react';
import {
  X,
  Sparkles,
  MapPin,
  Calendar,
  DollarSign,
  Users,
  Compass,
  Zap,
  Coffee,
  Footprints,
  Briefcase,
  Heart,
  Smile,
} from 'lucide-react';
import { TripPreferences, TravelStyle, TravelPace } from '../../types/itinerary';

interface TripBuilderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (prefs: TripPreferences) => void;
  initialDestination?: string;
}

const INTEREST_OPTIONS = [
  'Culture & History',
  'Foodie & Gastronomy',
  'Adventure & Outdoors',
  'Relaxation & Wellness',
  'Architecture & Design',
  'Art & Museums',
  'Local Markets & Shopping',
  'Nightlife & Bars',
  'Nature & Photography',
];

const STYLE_OPTIONS: { id: TravelStyle; label: string; icon: any; desc: string }[] = [
  { id: 'solo', label: 'Solo Explorer', icon: Footprints, desc: 'Maximum freedom & hidden spots' },
  { id: 'couple', label: 'Romantic Couple', icon: Heart, desc: 'Intimate dining & scenic walks' },
  { id: 'family', label: 'Family Vacation', icon: Smile, desc: 'Kid-friendly & relaxed logistics' },
  { id: 'friends', label: 'Friends Getaway', icon: Users, desc: 'Social spots & group activities' },
  { id: 'business', label: 'Work & Leisure', icon: Briefcase, desc: 'Productivity & evening highlights' },
];

const PACE_OPTIONS: { id: TravelPace; label: string; icon: any; desc: string }[] = [
  { id: 'relaxed', label: 'Relaxed', icon: Coffee, desc: '1-2 highlights a day, plenty of leisure' },
  { id: 'moderate', label: 'Moderate', icon: Compass, desc: 'Balanced rhythm, morning & afternoon sights' },
  { id: 'fast', label: 'Fast-Paced', icon: Zap, desc: 'Packed agenda to see everything possible' },
];

export const TripBuilderModal: React.FC<TripBuilderModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialDestination = '',
}) => {
  const [destination, setDestination] = useState(initialDestination || 'Kyoto, Japan');
  const [departureCity, setDepartureCity] = useState('San Francisco, CA');
  const [startDate, setStartDate] = useState('2026-11-05');
  const [endDate, setEndDate] = useState('2026-11-08');
  const [budget, setBudget] = useState<number>(2800);
  const [currency, setCurrency] = useState('USD');
  const [travelers, setTravelers] = useState<number>(2);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([
    'Culture & History',
    'Foodie & Gastronomy',
    'Architecture & Design',
  ]);
  const [travelStyle, setTravelStyle] = useState<TravelStyle>('couple');
  const [pace, setPace] = useState<TravelPace>('moderate');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const toggleInterest = (interest: string) => {
    if (selectedInterests.includes(interest)) {
      if (selectedInterests.length > 1) {
        setSelectedInterests(selectedInterests.filter((i) => i !== interest));
      }
    } else {
      setSelectedInterests([...selectedInterests, interest]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!destination.trim()) {
      setErrorMsg('Please specify a destination.');
      return;
    }
    if (!startDate || !endDate) {
      setErrorMsg('Please select start and end dates.');
      return;
    }
    if (new Date(startDate) > new Date(endDate)) {
      setErrorMsg('End date must be on or after start date.');
      return;
    }
    if (budget <= 0) {
      setErrorMsg('Please enter a valid budget.');
      return;
    }

    setErrorMsg('');
    onSubmit({
      destination: destination.trim(),
      departureCity: departureCity.trim() || 'Origin City',
      startDate,
      endDate,
      budget,
      currency,
      travelers,
      interests: selectedInterests,
      travelStyle,
      pace,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/80 backdrop-blur-md p-4 overflow-y-auto">
      <div className="glass-panel w-full max-w-2xl rounded-2xl border border-cyan-500/30 shadow-2xl p-6 sm:p-8 my-8 relative animate-fade-in max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-700/60 mb-6">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Smart Trip Planner</h3>
              <p className="text-xs text-slate-400">Configure parameters for AI itinerary generation</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-medium">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 text-left">
          {/* Destination & Departure */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                Destination City / Region
              </label>
              <input
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="e.g. Kyoto, Japan or Paris, France"
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-navy-850 border border-slate-700 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 text-sm text-white placeholder-slate-500 outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-blue-400" />
                Departure City
              </label>
              <input
                type="text"
                value={departureCity}
                onChange={(e) => setDepartureCity(e.target.value)}
                placeholder="e.g. San Francisco, CA"
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-navy-850 border border-slate-700 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 text-sm text-white placeholder-slate-500 outline-none transition-all"
              />
            </div>
          </div>

          {/* Dates & Travelers */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
                className="w-full px-3 py-2.5 rounded-xl bg-navy-850 border border-slate-700 focus:border-cyan-400 text-xs sm:text-sm text-white outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                End Date
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
                className="w-full px-3 py-2.5 rounded-xl bg-navy-850 border border-slate-700 focus:border-cyan-400 text-xs sm:text-sm text-white outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-purple-400" />
                Travelers
              </label>
              <select
                value={travelers}
                onChange={(e) => setTravelers(Number(e.target.value))}
                className="w-full px-3 py-2.5 rounded-xl bg-navy-850 border border-slate-700 focus:border-cyan-400 text-sm text-white outline-none"
              >
                <option value={1}>1 Solo traveler</option>
                <option value={2}>2 Travelers (Pair / Couple)</option>
                <option value={3}>3 Travelers</option>
                <option value={4}>4 Travelers</option>
                <option value={5}>5+ Group</option>
              </select>
            </div>
          </div>

          {/* Budget & Currency */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                Total Budget
              </label>
              <div className="relative">
                <input
                  type="number"
                  min={100}
                  step={50}
                  value={budget}
                  onChange={(e) => setBudget(Number(e.target.value))}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-navy-850 border border-slate-700 focus:border-cyan-400 text-sm text-white outline-none"
                />
                <span className="absolute right-3.5 top-2.5 text-xs text-slate-400 font-mono">
                  {currency}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Currency
              </label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-navy-850 border border-slate-700 focus:border-cyan-400 text-sm text-white outline-none"
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="JPY">JPY (¥)</option>
                <option value="CAD">CAD ($)</option>
                <option value="AUD">AUD ($)</option>
                <option value="INR">INR (₹)</option>
              </select>
            </div>
          </div>

          {/* Travel Style */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              Travel Style
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {STYLE_OPTIONS.map((style) => {
                const Icon = style.icon;
                const isSelected = travelStyle === style.id;
                return (
                  <button
                    type="button"
                    key={style.id}
                    onClick={() => setTravelStyle(style.id)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'bg-cyan-500/15 border-cyan-400 text-white shadow-glow-cyan-sm'
                        : 'bg-navy-850 border-slate-700 text-slate-300 hover:border-slate-500'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Icon className={`w-4 h-4 ${isSelected ? 'text-cyan-400' : 'text-slate-400'}`} />
                      <span className="text-xs font-semibold">{style.label}</span>
                    </div>
                    <p className="text-[10px] text-slate-400 leading-tight">{style.desc}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Pace */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              Preferred Pace
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              {PACE_OPTIONS.map((p) => {
                const Icon = p.icon;
                const isSelected = pace === p.id;
                return (
                  <button
                    type="button"
                    key={p.id}
                    onClick={() => setPace(p.id)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'bg-cyan-500/15 border-cyan-400 text-white shadow-glow-cyan-sm'
                        : 'bg-navy-850 border-slate-700 text-slate-300 hover:border-slate-500'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 mb-1">
                      <Icon className={`w-4 h-4 ${isSelected ? 'text-cyan-400' : 'text-slate-400'}`} />
                      <span className="text-xs font-semibold">{p.label}</span>
                    </div>
                    <p className="text-[10px] text-slate-400 leading-tight">{p.desc}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Interests */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              Interests & Focus (Select all that apply)
            </label>
            <div className="flex flex-wrap gap-2">
              {INTEREST_OPTIONS.map((interest) => {
                const isSelected = selectedInterests.includes(interest);
                return (
                  <button
                    type="button"
                    key={interest}
                    onClick={() => toggleInterest(interest)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      isSelected
                        ? 'bg-cyan-400 text-navy-950 font-semibold shadow-glow-cyan-sm'
                        : 'bg-navy-850 text-slate-300 border border-slate-700 hover:border-cyan-500/40'
                    }`}
                  >
                    {interest}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Submit */}
          <div className="pt-4 border-t border-slate-700/60 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl text-xs font-bold text-navy-950 bg-gradient-to-r from-cyan-400 to-cyan-300 hover:from-cyan-300 hover:to-cyan-200 transition-all shadow-glow-cyan flex items-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Generate Itinerary</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
