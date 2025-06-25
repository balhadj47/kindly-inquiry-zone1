
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PlusButtonProps {
  onClick: () => void;
  className?: string;
  size?: 'default' | 'sm' | 'lg' | 'icon';
  disabled?: boolean;
  children?: React.ReactNode;
  tooltip?: string;
  theme?: 'emerald' | 'purple' | 'orange' | 'pink' | 'cyan' | 'indigo';
}

const themeStyles = {
  emerald: 'from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 after:ring-emerald-300/50',
  purple: 'from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 after:ring-purple-300/50',
  orange: 'from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 after:ring-orange-300/50',
  pink: 'from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 after:ring-pink-300/50',
  cyan: 'from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 after:ring-cyan-300/50',
  indigo: 'from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 after:ring-indigo-300/50',
};

export const PlusButton: React.FC<PlusButtonProps> = ({
  onClick,
  className,
  size = 'icon',
  disabled = false,
  children,
  theme = 'emerald',
}) => {
  return (
    <Button
      onClick={onClick}
      disabled={disabled}
      size={size}
      className={cn(
        'relative w-12 h-12 rounded-xl bg-gradient-to-br text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 active:scale-95 border-0 group overflow-hidden',
        'before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/20 before:to-transparent before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300',
        'after:absolute after:inset-0 after:rounded-xl after:ring-2 after:opacity-0 hover:after:opacity-100 after:transition-opacity after:duration-300',
        themeStyles[theme],
        disabled && 'opacity-50 hover:scale-100 cursor-not-allowed',
        className
      )}
    >
      <div className="relative z-10 flex items-center justify-center">
        {children || <Plus className="h-5 w-5 transition-transform duration-200 group-hover:rotate-90" />}
      </div>
    </Button>
  );
};
