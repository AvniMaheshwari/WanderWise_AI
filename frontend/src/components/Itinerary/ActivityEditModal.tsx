import React, { useState, useEffect } from 'react';
import { X, Save, Clock, MapPin, DollarSign, Tag, FileText } from 'lucide-react';
import { Activity, Period, ActivityCategory } from '../../types/itinerary';

interface ActivityEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (activity: Activity) => void;
  initialActivity: Activity | null;
  dayNumber: number;
}

const CATEGORIES: ActivityCategory[] = [
  'Sightseeing',
  'Cultural',
  'Adventure',
  'Relaxation',
  'Shopping',
  'Food',
  'Nature',
  'Entertainment',
];

export const ActivityEditModal: React.FC<ActivityEditModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialActivity,
  dayNumber,
}) => {
  const [title, setTitle] = useState('');
  const [time, setTime] = useState('10:00 AM');
  const [period, setPeriod] = useState<Period>('morning');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [duration, setDuration] = useState('1.5 hours');
  const [cost, setCost] = useState(0);
  const [category, setCategory] = useState<ActivityCategory>('Sightseeing');
  const [bookingRequired, setBookingRequired] = useState(false);
  const [tips, setTips] = useState('');

  useEffect(() => {
    if (initialActivity) {
      setTitle(initialActivity.title);
      setTime(initialActivity.time);
      setPeriod(initialActivity.period);
      setDescription(initialActivity.description);
      setLocation(initialActivity.location);
      setDuration(initialActivity.duration);
      setCost(initialActivity.cost);
      setCategory(initialActivity.category);
      setBookingRequired(Boolean(initialActivity.bookingRequired));
      setTips(initialActivity.tips || '');
    } else {
      setTitle('');
      setTime('10:00 AM');
      setPeriod('morning');
      setDescription('');
      setLocation('');
      setDuration('1.5 hours');
      setCost(0);
      setCategory('Sightseeing');
      setBookingRequired(false);
      setTips('');
    }
  }, [initialActivity, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const saved: Activity = {
      id: initialActivity ? initialActivity.id : `act-custom-${Date.now()}`,
      title: title.trim(),
      time,
      period,
      description: description.trim(),
      location: location.trim() || 'Central Location',
      coordinates: initialActivity?.coordinates || { lat: 35.01, lng: 135.76 },
      duration,
      cost: Number(cost),
      category,
      bookingRequired,
      tips: tips.trim() || undefined,
    };

    onSave(saved);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/80 backdrop-blur-md p-4 overflow-y-auto">
      <div className="glass-panel w-full max-w-lg rounded-2xl border border-cyan-500/30 p-6 shadow-2xl relative animate-fade-in max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-slate-700/60 mb-5">
          <h3 className="text-lg font-bold text-white">
            {initialActivity ? 'Edit Activity' : `Add Activity to Day ${dayNumber}`}
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Traditional Tea House Tasting"
              required
              className="w-full px-3 py-2 rounded-xl bg-navy-850 border border-slate-700 focus:border-cyan-400 text-sm text-white outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1">
                <Clock className="w-3 h-3 text-cyan-400" /> Time
              </label>
              <input
                type="text"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                placeholder="e.g. 09:30 AM"
                className="w-full px-3 py-2 rounded-xl bg-navy-850 border border-slate-700 focus:border-cyan-400 text-sm text-white outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Period</label>
              <select
                value={period}
                onChange={(e) => setPeriod(e.target.value as Period)}
                className="w-full px-3 py-2 rounded-xl bg-navy-850 border border-slate-700 focus:border-cyan-400 text-sm text-white outline-none"
              >
                <option value="morning">Morning</option>
                <option value="afternoon">Afternoon</option>
                <option value="evening">Evening</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1">
                <Tag className="w-3 h-3 text-purple-400" /> Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ActivityCategory)}
                className="w-full px-3 py-2 rounded-xl bg-navy-850 border border-slate-700 focus:border-cyan-400 text-sm text-white outline-none"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1">
                <DollarSign className="w-3 h-3 text-emerald-400" /> Cost (USD)
              </label>
              <input
                type="number"
                min={0}
                value={cost}
                onChange={(e) => setCost(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-navy-850 border border-slate-700 focus:border-cyan-400 text-sm text-white outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-cyan-400" /> Location
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="District or street name"
                className="w-full px-3 py-2 rounded-xl bg-navy-850 border border-slate-700 focus:border-cyan-400 text-sm text-white outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Duration</label>
              <input
                type="text"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="e.g. 2 hours"
                className="w-full px-3 py-2 rounded-xl bg-navy-850 border border-slate-700 focus:border-cyan-400 text-sm text-white outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1">
              <FileText className="w-3 h-3 text-slate-400" /> Description
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What to see and experience..."
              required
              className="w-full px-3 py-2 rounded-xl bg-navy-850 border border-slate-700 focus:border-cyan-400 text-xs sm:text-sm text-white outline-none resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Pro Tips (Optional)
            </label>
            <input
              type="text"
              value={tips}
              onChange={(e) => setTips(e.target.value)}
              placeholder="e.g. Arrive 15 mins early to avoid line"
              className="w-full px-3 py-2 rounded-xl bg-navy-850 border border-slate-700 focus:border-cyan-400 text-sm text-white outline-none"
            />
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="bookingCheck"
              checked={bookingRequired}
              onChange={(e) => setBookingRequired(e.target.checked)}
              className="rounded bg-navy-850 border-slate-700 text-cyan-500 focus:ring-cyan-400"
            />
            <label htmlFor="bookingCheck" className="text-xs text-slate-300 select-none cursor-pointer">
              Advance booking or ticket required
            </label>
          </div>

          <div className="pt-4 border-t border-slate-700/60 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-xs font-bold text-navy-950 bg-gradient-to-r from-cyan-400 to-cyan-300 hover:from-cyan-300 transition-all shadow-glow-cyan-sm flex items-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{initialActivity ? 'Update Activity' : 'Add Activity'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
