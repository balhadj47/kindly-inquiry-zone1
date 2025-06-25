
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
}

export const PlusButton: React.FC<PlusButtonProps> = ({
  onClick,
  className,
  size = 'icon',
  disabled = false,
  children,
}) => {
  return (
    <Button
      onClick={onClick}
      disabled={disabled}
      size={size}
      className={cn(
        'relative w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 active:scale-95 border-0 group overflow-hidden',
        'before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/20 before:to-transparent before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300',
        'after:absolute after:inset-0 after:rounded-xl after:ring-2 after:ring-emerald-300/50 after:opacity-0 hover:after:opacity-100 after:transition-opacity after:duration-300',
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
