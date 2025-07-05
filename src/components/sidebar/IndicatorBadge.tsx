
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface IndicatorBadgeProps {
  count: number;
  variant?: 'default' | 'secondary' | 'destructive' | 'outline';
  className?: string;
}

const IndicatorBadge: React.FC<IndicatorBadgeProps> = ({ 
  count, 
  variant = 'default',
  className = ''
}) => {
  if (count === 0) return null;

  return (
    <Badge 
      variant={variant} 
      className={`ml-auto text-xs px-2 py-0.5 min-w-[20px] h-5 flex items-center justify-center ${className}`}
    >
      {count > 99 ? '99+' : count}
    </Badge>
  );
};

export default IndicatorBadge;
