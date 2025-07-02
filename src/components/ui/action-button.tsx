
import React from 'react';
import { Button } from '@/components/ui/button';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ActionButtonProps {
  onClick: () => void;
  icon: LucideIcon;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'default' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  className?: string;
}

export const ActionButton: React.FC<ActionButtonProps> = ({
  onClick,
  icon: Icon,
  children,
  variant = 'primary',
  size = 'default',
  disabled = false,
  loading = false,
  className
}) => {
  const baseClasses = "font-medium transition-all duration-200 hover:shadow-md active:scale-95";
  
  const variantClasses = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white shadow-sm",
    secondary: "bg-gray-100 hover:bg-gray-200 text-gray-800 border border-gray-300",
    outline: "border-2 border-blue-600 text-blue-600 hover:bg-blue-50"
  };

  const sizeClasses = {
    sm: "h-9 px-3 text-sm",
    default: "h-10 px-4",
    lg: "h-11 px-6 text-base"
  };

  return (
    <Button
      onClick={onClick}
      disabled={disabled || loading}
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
    >
      <Icon className={cn(
        "mr-2",
        size === 'sm' ? 'h-4 w-4' : size === 'lg' ? 'h-5 w-5' : 'h-4 w-4',
        loading && 'animate-spin'
      )} />
      {children}
    </Button>
  );
};
