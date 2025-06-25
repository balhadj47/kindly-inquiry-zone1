
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PlusButtonProps {
  onClick: () => void;
  className?: string;
  disabled?: boolean;
  children?: React.ReactNode;
  tooltip?: string;
  variant?: 'dashboard' | 'users' | 'vans' | 'companies' | 'auth-users';
}

export const PlusButton: React.FC<PlusButtonProps> = ({
  onClick,
  className,
  disabled = false,
  children,
  variant = 'dashboard',
}) => {
  // Dashboard: Hexagonal with gradient
  if (variant === 'dashboard') {
    return (
      <div className="relative">
        <Button
          onClick={onClick}
          disabled={disabled}
          className={cn(
            'w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 active:scale-95',
            'clip-path-hexagon relative overflow-hidden group',
            disabled && 'opacity-50 hover:scale-100 cursor-not-allowed',
            className
          )}
          style={{
            clipPath: 'polygon(30% 0%, 70% 0%, 100% 50%, 70% 100%, 30% 100%, 0% 50%)',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="relative z-10">
            {children || <Plus className="h-5 w-5 transition-transform duration-200 group-hover:rotate-90" />}
          </div>
        </Button>
      </div>
    );
  }

  // Users: Square with neon border
  if (variant === 'users') {
    return (
      <Button
        onClick={onClick}
        disabled={disabled}
        className={cn(
          'w-12 h-12 bg-slate-900 hover:bg-slate-800 text-orange-400 border-2 border-orange-400 hover:border-orange-300 shadow-[0_0_20px_rgba(251,146,60,0.3)] hover:shadow-[0_0_30px_rgba(251,146,60,0.5)] transition-all duration-300 hover:scale-105 active:scale-95 group',
          'before:absolute before:inset-0 before:bg-orange-400/10 before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300',
          disabled && 'opacity-50 hover:scale-100 cursor-not-allowed',
          className
        )}
      >
        {children || <Plus className="h-5 w-5 transition-transform duration-200 group-hover:rotate-180" />}
      </Button>
    );
  }

  // Vans: Diamond shape with metallic effect
  if (variant === 'vans') {
    return (
      <div className="relative">
        <Button
          onClick={onClick}
          disabled={disabled}
          className={cn(
            'w-12 h-12 bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800 hover:from-purple-700 hover:via-purple-800 hover:to-indigo-900 text-white border-0 shadow-lg hover:shadow-purple-500/25 transition-all duration-300 hover:scale-110 active:scale-95 rotate-45 group',
            'before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/30 before:to-transparent before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300',
            disabled && 'opacity-50 hover:scale-100 cursor-not-allowed',
            className
          )}
        >
          <div className="relative z-10 -rotate-45">
            {children || <Plus className="h-5 w-5 transition-transform duration-200 group-hover:rotate-90" />}
          </div>
        </Button>
      </div>
    );
  }

  // Companies: Rounded with glass morphism
  if (variant === 'companies') {
    return (
      <Button
        onClick={onClick}
        disabled={disabled}
        className={cn(
          'w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 hover:border-white/30 text-blue-600 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 active:scale-95 group',
          'before:absolute before:inset-0 before:rounded-full before:bg-gradient-to-br before:from-blue-400/20 before:to-cyan-400/20 before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300',
          disabled && 'opacity-50 hover:scale-100 cursor-not-allowed',
          className
        )}
      >
        {children || <Plus className="h-5 w-5 transition-transform duration-200 group-hover:rotate-90 drop-shadow-sm" />}
      </Button>
    );
  }

  // Auth Users: Triangular with cyber theme
  if (variant === 'auth-users') {
    return (
      <div className="relative">
        <Button
          onClick={onClick}
          disabled={disabled}
          className={cn(
            'w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white border-0 shadow-lg hover:shadow-cyan-500/25 transition-all duration-300 hover:scale-110 active:scale-95 group',
            'before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/20 before:to-transparent before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300',
            disabled && 'opacity-50 hover:scale-100 cursor-not-allowed',
            className
          )}
          style={{
            clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
          }}
        >
          <div className="relative z-10 mt-2">
            {children || <Plus className="h-4 w-4 transition-transform duration-200 group-hover:rotate-180" />}
          </div>
        </Button>
      </div>
    );
  }

  return null;
};
