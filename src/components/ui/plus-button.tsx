
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
        'w-10 h-10 rounded-md bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105',
        className
      )}
    >
      {children || <Plus className="h-4 w-4" />}
    </Button>
  );
};
