
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
}) => {
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
};
