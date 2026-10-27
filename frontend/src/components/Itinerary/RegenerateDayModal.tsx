import React, { useState } from 'react';
import { X, RefreshCw, Sparkles, MessageSquare } from 'lucide-react';

interface RegenerateDayModalProps {
  isOpen: boolean;
  onClose: () => void;
  dayNumber: number;
  destination: string;
  onConfirm: (dayNumber: number, customInstructions: string) => void;
  isRegenerating: boolean;
}

const PRESET_PROMPTS = [
  'Focus more on hidden culinary spots & street food',
  'Swap for indoor cultural sights & museums',
  'More relaxed walking pace with botanical gardens',
  'Include high-adrenaline adventure or scenic hike',
  'Romantic sunset views & evening cocktail lounges',
];

export const RegenerateDayModal: React.FC<RegenerateDayModalProps> = ({
  isOpen,
  onClose,
  dayNumber,
  destination,
  onConfirm,
  isRegenerating,
}) => {
  const [customInstructions, setCustomInstructions] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm(dayNumber, customInstructions);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/80 backdrop-blur-md p-4 overflow-y-auto">
      <div className="glass-panel w-full max-w-lg rounded-2xl border border-cyan-500/30 p-6 sm:p-7 shadow-2xl relative animate-fade-in">
        <div className="flex items-center justify-between pb-3 border-b border-slate-700/60 mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <RefreshCw className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white">
                Regenerate Day {dayNumber}
              </h3>
              <p className="text-xs text-slate-400">Targeted AI synthesis for {destination}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isRegenerating}
            className="p-1 rounded-lg text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-cyan-400" />
              Custom Instructions for Day {dayNumber} (Optional)
            </label>
            <textarea
              rows={3}
              value={customInstructions}
              onChange={(e) => setCustomInstructions(e.target.value)}
              placeholder="e.g. Replace afternoon temples with modern architecture galleries and artisan coffee..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-navy-850 border border-slate-700 focus:border-cyan-400 text-xs sm:text-sm text-white outline-none resize-none"
            />
          </div>

          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
              Quick Suggestion Presets:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {PRESET_PROMPTS.map((prompt) => (
                <button
                  type="button"
                  key={prompt}
                  onClick={() => setCustomInstructions(prompt)}
                  className="px-2.5 py-1 rounded-lg text-xs bg-navy-850 hover:bg-cyan-500/15 text-slate-300 hover:text-cyan-300 border border-slate-700/60 hover:border-cyan-500/30 transition-all text-left"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>

          <p className="text-[11px] text-slate-400 bg-navy-850/50 p-2.5 rounded-lg border border-white/5">
            💡 WanderWise AI will generate a completely fresh schedule for Day {dayNumber} while preserving the rest of your itinerary.
          </p>

          <div className="pt-4 border-t border-slate-700/60 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isRegenerating}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isRegenerating}
              className="px-5 py-2.5 rounded-xl text-xs font-bold text-navy-950 bg-gradient-to-r from-cyan-400 to-cyan-300 hover:from-cyan-300 transition-all shadow-glow-cyan-sm flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Sparkles className={`w-3.5 h-3.5 ${isRegenerating ? 'animate-spin' : ''}`} />
              <span>{isRegenerating ? 'Synthesizing Day...' : 'Regenerate Day'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
