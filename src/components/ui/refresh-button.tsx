
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RefreshButtonProps {
  onRefresh: () => void | Promise<void>;
  className?: string;
  size?: 'default' | 'sm' | 'lg' | 'icon';
  variant?: 'default' | 'outline' | 'ghost' | 'secondary';
  disabled?: boolean;
  children?: React.ReactNode;
}

export const RefreshButton: React.FC<RefreshButtonProps> = ({
  onRefresh,
  className,
  size = 'icon',
  variant = 'outline',
  disabled = false,
  children,
}) => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    if (isRefreshing || disabled) return;
    
    console.log('🔄 RefreshButton: Starting refresh...');
    setIsRefreshing(true);
    
    try {
      const result = onRefresh();
      if (result instanceof Promise) {
        await result;
      }
      console.log('✅ RefreshButton: Refresh completed');
    } catch (error) {
      console.error('❌ RefreshButton: Refresh failed:', error);
    } finally {
      // Short delay to show the animation
      setTimeout(() => {
        setIsRefreshing(false);
      }, 500);
    }
  };

  return (
    <Button
      onClick={handleRefresh}
      disabled={disabled || isRefreshing}
      size={size}
      variant={variant}
      className={cn(
        'relative w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 active:scale-95 border-0 group overflow-hidden',
        'before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/20 before:to-transparent before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300',
        'after:absolute after:inset-0 after:rounded-xl after:ring-2 after:ring-blue-300/50 after:opacity-0 hover:after:opacity-100 after:transition-opacity after:duration-300',
        isRefreshing && 'opacity-75 hover:scale-100',
        disabled && 'opacity-50 hover:scale-100 cursor-not-allowed',
        className
      )}
    >
      <div className="relative z-10 flex items-center justify-center">
        {children || (
          <RefreshCw 
            className={cn(
              "h-5 w-5 transition-transform duration-200", 
              isRefreshing && "animate-spin"
            )} 
          />
        )}
      </div>
    </Button>
  );
};
