
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RefreshButtonProps {
  onRefresh: () => void | Promise<void>;
  className?: string;
  disabled?: boolean;
  children?: React.ReactNode;
  variant?: 'dashboard' | 'users' | 'vans' | 'companies' | 'auth-users';
}

export const RefreshButton: React.FC<RefreshButtonProps> = ({
  onRefresh,
  className,
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
      setTimeout(() => {
        setIsRefreshing(false);
      }, 500);
    }
  };

  return (
    <div className="relative">
      <Button
        onClick={handleRefresh}
        disabled={disabled || isRefreshing}
        className={cn(
          'w-12 h-12 bg-black border-2 border-cyan-400 hover:border-cyan-300 text-cyan-400 hover:text-cyan-300 shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] transition-all duration-300 hover:scale-110 active:scale-95 group',
          'before:absolute before:inset-0 before:bg-cyan-400/5 before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300',
          isRefreshing && 'opacity-75 hover:scale-100 animate-pulse',
          disabled && 'opacity-50 hover:scale-100 cursor-not-allowed',
          className
        )}
        style={{
          clipPath: 'polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)',
        }}
      >
        {/* Cyber grid lines */}
        <div className="absolute inset-1 border border-cyan-400/30 opacity-50" 
             style={{ clipPath: 'polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)' }} />
        <div className="relative z-10">
          {children || (
            <RefreshCw 
              className={cn(
                "h-4 w-4 transition-transform duration-200", 
                isRefreshing && "animate-spin"
              )} 
            />
          )}
        </div>
      </Button>
    </div>
  );
};
