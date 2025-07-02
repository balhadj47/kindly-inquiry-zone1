
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className }) => {
  const getStatusConfig = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return {
          className: 'bg-green-100 text-green-800 border-green-200 hover:bg-green-200',
          variant: 'outline' as const
        };
      case 'inactive':
        return {
          className: 'bg-red-100 text-red-800 border-red-200 hover:bg-red-200',
          variant: 'outline' as const
        };
      case 'maintenance':
        return {
          className: 'bg-orange-100 text-orange-800 border-orange-200 hover:bg-orange-200',
          variant: 'outline' as const
        };
      case 'en transit':
        return {
          className: 'bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200',
          variant: 'outline' as const
        };
      default:
        return {
          className: 'bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200',
          variant: 'outline' as const
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <Badge 
      variant={config.variant}
      className={cn(
        'font-medium text-xs px-2 py-1 transition-colors duration-200',
        config.className,
        className
      )}
    >
      {status}
    </Badge>
  );
};
