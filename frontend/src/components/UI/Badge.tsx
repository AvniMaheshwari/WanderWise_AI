import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'cyan' | 'blue' | 'purple' | 'emerald' | 'amber' | 'slate';
  className?: string;
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'cyan',
  className = '',
  size = 'md',
}) => {
  const variantStyles = {
    cyan: 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30',
    blue: 'bg-blue-500/10 text-blue-400 border border-blue-500/30',
    purple: 'bg-purple-500/10 text-purple-400 border border-purple-500/30',
    emerald: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30',
    amber: 'bg-amber-500/10 text-amber-400 border border-amber-500/30',
    slate: 'bg-slate-800 text-slate-300 border border-slate-700',
  };

  const sizeStyles = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-xs md:text-sm px-2.5 py-1',
  };

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full transition-colors ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
    >
      {children}
    </span>
  );
};
