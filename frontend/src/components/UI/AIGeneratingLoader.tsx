import React, { useEffect, useState } from 'react';
import { Sparkles, Compass, MapPin, DollarSign, CheckCircle2 } from 'lucide-react';

interface AIGeneratingLoaderProps {
  destination: string;
  travelers: number;
  durationDays: number;
}

const PHASES = [
  { text: 'Scanning local landmarks, cultural heritage & hidden alleys...', icon: Compass },
  { text: 'Matching traveler pace and preferred interests...', icon: MapPin },
  { text: 'Curating authentic dining & neighborhood boutique hotels...', icon: Sparkles },
  { text: 'Synthesizing coordinates, daily transit & budget breakdown...', icon: DollarSign },
];

export const AIGeneratingLoader: React.FC<AIGeneratingLoaderProps> = ({
  destination,
  travelers,
  durationDays,
}) => {
  const [currentPhase, setCurrentPhase] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPhase((prev) => (prev < PHASES.length - 1 ? prev + 1 : prev));
    }, 1100);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/85 backdrop-blur-md px-4">
      <div className="glass-panel w-full max-w-lg p-8 rounded-2xl shadow-glow-cyan text-center relative overflow-hidden border border-cyan-500/40">
        {/* Glow ambient background */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Orbiting AI Core icon */}
        <div className="relative w-20 h-20 mx-auto mb-6 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border-2 border-dashed border-cyan-400 animate-spin" style={{ animationDuration: '8s' }} />
          <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-glow-cyan text-navy-950">
            <Sparkles className="w-7 h-7 text-white animate-pulse" />
          </div>
        </div>

        <h3 className="text-2xl font-bold text-white mb-2">
          Generating Itinerary for <span className="text-cyan-400">{destination}</span>
        </h3>
        <p className="text-slate-400 text-sm mb-6">
          WanderWise AI is synthesizing a {durationDays}-day personalized journey for {travelers} traveler(s).
        </p>

        {/* Progress tracker steps */}
        <div className="space-y-3 text-left mb-6">
          {PHASES.map((phase, idx) => {
            const Icon = phase.icon;
            const isCompleted = idx < currentPhase;
            const isCurrent = idx === currentPhase;

            return (
              <div
                key={idx}
                className={`flex items-center gap-3 p-2.5 rounded-lg transition-all duration-300 ${
                  isCurrent
                    ? 'bg-cyan-500/15 border border-cyan-500/40 text-cyan-200'
                    : isCompleted
                    ? 'text-slate-400 opacity-80'
                    : 'text-slate-600 opacity-40'
                }`}
              >
                {isCompleted ? (
                  <CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0" />
                ) : (
                  <Icon className={`w-5 h-5 shrink-0 ${isCurrent ? 'text-cyan-400 animate-spin' : ''}`} />
                )}
                <span className="text-xs md:text-sm font-medium">{phase.text}</span>
              </div>
            );
          })}
        </div>

        {/* Bar */}
        <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full transition-all duration-700 ease-out shadow-glow-cyan-sm"
            style={{ width: `${((currentPhase + 1) / PHASES.length) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
};
