
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
}

export const RefreshButton: React.FC<RefreshButtonProps> = ({
  onRefresh,
  className,
  size = 'icon',
  variant = 'outline',
  disabled = false,
}) => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    if (isRefreshing || disabled) return;
    
    console.log('🔄 RefreshButton: Starting refresh...');
    setIsRefreshing(true);
    
    try {
      // Clear ALL caches immediately for faster updates
      if (typeof window !== 'undefined') {
        (window as any).globalVansCache = null;
        (window as any).globalFetchPromise = null;
        console.log('🔄 RefreshButton: Cleared global caches');
      }
      
      // Call the refresh function which should force fresh data
      await onRefresh();
      console.log('✅ RefreshButton: Refresh completed');
    } catch (error) {
      console.error('❌ RefreshButton: Refresh failed:', error);
    } finally {
      // Shorter animation time for better responsiveness
      setTimeout(() => {
        setIsRefreshing(false);
      }, 200);
    }
  };

  return (
    <Button
      onClick={handleRefresh}
      disabled={disabled || isRefreshing}
      size={size}
      variant={variant}
      className={cn(
        'transition-all duration-200',
        isRefreshing && 'opacity-75',
        className
      )}
    >
      <RefreshCw 
        className={cn(
          "h-4 w-4", 
          isRefreshing && "animate-spin"
        )} 
      />
    </Button>
  );
};
