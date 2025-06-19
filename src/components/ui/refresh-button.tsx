
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
  size = 'default',
  variant = 'outline',
  disabled = false,
}) => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    if (isRefreshing || disabled) return;
    
    console.log('🔄 RefreshButton: Starting refresh...');
    setIsRefreshing(true);
    
    try {
      await onRefresh();
      console.log('✅ RefreshButton: Refresh completed');
    } catch (error) {
      console.error('❌ RefreshButton: Refresh failed:', error);
    } finally {
      // Ensure minimum animation time for better UX
      setTimeout(() => {
        setIsRefreshing(false);
        console.log('🔄 RefreshButton: Animation completed');
      }, 800);
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
          isRefreshing && "animate-spin",
          size !== 'icon' && "mr-2"
        )} 
      />
      {size !== 'icon' && (isRefreshing ? 'Actualisation...' : 'Actualiser')}
    </Button>
  );
};
