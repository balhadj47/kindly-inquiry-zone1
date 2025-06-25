
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
  variant = 'dashboard',
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

  // Dashboard: Circular with pulsing ring
  if (variant === 'dashboard') {
    return (
      <div className="relative">
        <Button
          onClick={handleRefresh}
          disabled={disabled || isRefreshing}
          className={cn(
            'w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 active:scale-95 group',
            'before:absolute before:inset-0 before:rounded-full before:bg-gradient-to-br before:from-white/20 before:to-transparent before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300',
            isRefreshing && 'opacity-75 hover:scale-100',
            disabled && 'opacity-50 hover:scale-100 cursor-not-allowed',
            className
          )}
        >
          {/* Pulsing ring animation */}
          {isRefreshing && (
            <div className="absolute -inset-2 rounded-full border-2 border-green-400 animate-ping opacity-75" />
          )}
          <div className="relative z-10">
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
      </div>
    );
  }

  // Users: Octagonal with electric effect
  if (variant === 'users') {
    return (
      <Button
        onClick={handleRefresh}
        disabled={disabled || isRefreshing}
        className={cn(
          'w-12 h-12 bg-gradient-to-br from-violet-600 to-purple-700 hover:from-violet-700 hover:to-purple-800 text-white border-0 shadow-lg hover:shadow-violet-500/25 transition-all duration-300 hover:scale-110 active:scale-95 group',
          'before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/20 before:to-transparent before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300',
          isRefreshing && 'opacity-75 hover:scale-100',
          disabled && 'opacity-50 hover:scale-100 cursor-not-allowed',
          className
        )}
        style={{
          clipPath: 'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)',
        }}
      >
        <div className="relative z-10">
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
  }

  // Vans: Star shape with metallic shimmer
  if (variant === 'vans') {
    return (
      <div className="relative">
        <Button
          onClick={handleRefresh}
          disabled={disabled || isRefreshing}
          className={cn(
            'w-14 h-14 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 text-white border-0 shadow-lg hover:shadow-purple-500/25 transition-all duration-300 hover:scale-110 active:scale-95 group',
            'before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/30 before:via-transparent before:to-white/10 before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300',
            isRefreshing && 'opacity-75 hover:scale-100 animate-pulse',
            disabled && 'opacity-50 hover:scale-100 cursor-not-allowed',
            className
          )}
          style={{
            clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)',
          }}
        >
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
  }

  // Companies: Oval with soft glow
  if (variant === 'companies') {
    return (
      <Button
        onClick={handleRefresh}
        disabled={disabled || isRefreshing}
        className={cn(
          'w-16 h-10 rounded-full bg-gradient-to-r from-sky-400 to-blue-500 hover:from-sky-500 hover:to-blue-600 text-white border-0 shadow-lg hover:shadow-blue-500/25 transition-all duration-300 hover:scale-110 active:scale-95 group',
          'before:absolute before:inset-0 before:rounded-full before:bg-gradient-to-r before:from-white/20 before:to-transparent before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300',
          isRefreshing && 'opacity-75 hover:scale-100',
          disabled && 'opacity-50 hover:scale-100 cursor-not-allowed',
          className
        )}
      >
        {/* Soft glow effect */}
        {isRefreshing && (
          <div className="absolute -inset-1 rounded-full bg-blue-400/50 blur-sm animate-pulse" />
        )}
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
    );
  }

  // Auth Users: Pentagon with neon cyber effect
  if (variant === 'auth-users') {
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
  }

  return null;
};
