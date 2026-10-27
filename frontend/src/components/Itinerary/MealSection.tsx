import React from 'react';
import { Utensils, Coffee, Sun, Moon, DollarSign } from 'lucide-react';
import { MealRecommendation } from '../../types/itinerary';

interface MealSectionProps {
  meals: {
    breakfast: MealRecommendation;
    lunch: MealRecommendation;
    dinner: MealRecommendation;
  };
}

export const MealSection: React.FC<MealSectionProps> = ({ meals }) => {
  const mealItems = [
    {
      title: 'Breakfast',
      data: meals.breakfast,
      icon: Coffee,
      color: 'text-amber-400',
      bg: 'bg-amber-500/10 border-amber-500/20',
    },
    {
      title: 'Lunch',
      data: meals.lunch,
      icon: Sun,
      color: 'text-cyan-400',
      bg: 'bg-cyan-500/10 border-cyan-500/20',
    },
    {
      title: 'Dinner',
      data: meals.dinner,
      icon: Moon,
      color: 'text-indigo-400',
      bg: 'bg-indigo-500/10 border-indigo-500/20',
    },
  ];

  return (
    <div className="mt-4 pt-4 border-t border-slate-800">
      <div className="flex items-center gap-2 mb-3">
        <Utensils className="w-4 h-4 text-cyan-400" />
        <h5 className="text-xs font-bold uppercase tracking-wider text-slate-300">
          Curated Dining & Flavors
        </h5>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {mealItems.map(({ title, data, icon: Icon, color, bg }) => (
          <div
            key={title}
            className={`p-3.5 rounded-xl border ${bg} text-left flex flex-col justify-between`}
          >
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className={`text-[11px] font-bold uppercase tracking-wider flex items-center gap-1 ${color}`}>
                  <Icon className="w-3 h-3" />
                  {title}
                </span>
                <span className="text-xs font-mono font-semibold text-emerald-400">
                  ~${data.estimatedCost}
                </span>
              </div>
              <p className="text-xs font-bold text-white mb-0.5">{data.restaurant}</p>
              <p className="text-[11px] text-cyan-300/80 mb-1">{data.cuisine}</p>
              <p className="text-[11px] text-slate-400 leading-snug">{data.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
