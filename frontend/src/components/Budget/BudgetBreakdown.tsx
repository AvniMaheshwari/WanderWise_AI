import React from 'react';
import { DollarSign, AlertTriangle, CheckCircle, TrendingDown, TrendingUp, PieChart } from 'lucide-react';
import { ExpenseBreakdown } from '../../types/itinerary';

interface BudgetBreakdownProps {
  budget: number;
  expenses: ExpenseBreakdown;
  currency: string;
}

export const BudgetBreakdown: React.FC<BudgetBreakdownProps> = ({
  budget,
  expenses,
  currency,
}) => {
  const isOverBudget = expenses.total > budget;
  const difference = Math.abs(expenses.total - budget);
  const percentageUsed = Math.round((expenses.total / budget) * 100);

  const categories = [
    {
      label: 'Accommodation',
      amount: expenses.accommodation,
      color: 'bg-cyan-400',
      textColor: 'text-cyan-400',
      pct: Math.round((expenses.accommodation / (expenses.total || 1)) * 100),
    },
    {
      label: 'Dining & Food',
      amount: expenses.food,
      color: 'bg-amber-400',
      textColor: 'text-amber-400',
      pct: Math.round((expenses.food / (expenses.total || 1)) * 100),
    },
    {
      label: 'Activities & Tours',
      amount: expenses.activities,
      color: 'bg-purple-400',
      textColor: 'text-purple-400',
      pct: Math.round((expenses.activities / (expenses.total || 1)) * 100),
    },
    {
      label: 'Local Transport',
      amount: expenses.transport,
      color: 'bg-blue-400',
      textColor: 'text-blue-400',
      pct: Math.round((expenses.transport / (expenses.total || 1)) * 100),
    },
    {
      label: 'Misc & Buffer',
      amount: expenses.miscellaneous,
      color: 'bg-emerald-400',
      textColor: 'text-emerald-400',
      pct: Math.round((expenses.miscellaneous / (expenses.total || 1)) * 100),
    },
  ];

  return (
    <div className="glass-panel rounded-2xl border border-cyan-500/25 p-6 sm:p-7 mb-8 shadow-glow-card text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-700/60">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <PieChart className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Budget & Expense Validation</h3>
            <p className="text-xs text-slate-400">Real-time financial synthesis against planned budget</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Target Budget</span>
            <span className="text-base font-extrabold text-white font-mono">
              ${budget.toLocaleString()} {currency}
            </span>
          </div>
          <div className="h-8 w-px bg-slate-700" />
          <div className="text-right">
            <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Estimated Total</span>
            <span className={`text-base font-extrabold font-mono ${isOverBudget ? 'text-rose-400' : 'text-cyan-400'}`}>
              ${expenses.total.toLocaleString()} {currency}
            </span>
          </div>
        </div>
      </div>

      {/* Budget Validation Alert */}
      <div className="my-5">
        {isOverBudget ? (
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <div>
              <h5 className="text-xs font-bold text-rose-300">
                Budget Exceeded by ${difference.toLocaleString()} {currency} ({percentageUsed}% of planned limit)
              </h5>
              <p className="text-[11px] text-slate-300 mt-0.5 leading-relaxed">
                Consider choosing boutique lofts rather than luxury hotels, or swappable free walking attractions to bring estimated expenses within budget.
              </p>
            </div>
          </div>
        ) : (
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <h5 className="text-xs font-bold text-emerald-300">
                Budget Validated: Under Planned Budget by ${difference.toLocaleString()} {currency} ({percentageUsed}% allocated)
              </h5>
              <p className="text-[11px] text-slate-300 mt-0.5 leading-relaxed">
                Your itinerary remains comfortably within financial bounds with a ${(budget - expenses.total).toLocaleString()} buffer for spontaneous activities or souvenirs.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Multi-segment stacked bar */}
      <div className="mb-6">
        <div className="flex justify-between text-xs text-slate-400 mb-1.5 font-medium">
          <span>Expense Distribution</span>
          <span className="font-mono text-cyan-300">{percentageUsed}% Allocated</span>
        </div>
        <div className="w-full h-3 rounded-full bg-slate-800 flex overflow-hidden p-0.5 border border-slate-700/60">
          {categories.map((cat, i) => (
            <div
              key={i}
              className={`${cat.color} h-full transition-all duration-500 first:rounded-l-full last:rounded-r-full`}
              style={{ width: `${cat.pct}%` }}
              title={`${cat.label}: $${cat.amount} (${cat.pct}%)`}
            />
          ))}
        </div>
      </div>

      {/* Category grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {categories.map((cat, idx) => (
          <div key={idx} className="p-3 rounded-xl bg-navy-850/80 border border-slate-700/60">
            <div className="flex items-center gap-1.5 mb-1">
              <span className={`w-2.5 h-2.5 rounded-full ${cat.color}`} />
              <span className="text-[11px] font-semibold text-slate-300 truncate">{cat.label}</span>
            </div>
            <div className="text-sm font-extrabold text-white font-mono">
              ${cat.amount.toLocaleString()}
            </div>
            <div className="text-[10px] text-slate-400 font-mono mt-0.5">
              {cat.pct}% of total
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
