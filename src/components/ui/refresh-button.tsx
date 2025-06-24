
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
        'w-10 h-10 rounded-md bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105',
        isRefreshing && 'opacity-75',
        className
      )}
    >
      {children || (
        <RefreshCw 
          className={cn(
            "h-4 w-4", 
            isRefreshing && "animate-spin"
          )} 
        />
      )}
    </Button>
  );
};
