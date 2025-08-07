
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface EntityCardProps {
  title: string;
  subtitle?: string;
  status?: {
    label: string;
    variant: 'default' | 'secondary' | 'destructive' | 'outline';
    color?: string;
  };
  metadata?: Array<{
    label: string;
    value: string;
    icon?: React.ReactNode;
  }>;
  actions?: React.ReactNode;
  onClick?: () => void;
  className?: string;
  children?: React.ReactNode;
}

export const EntityCard: React.FC<EntityCardProps> = ({
  title,
  subtitle,
  status,
  metadata,
  actions,
  onClick,
  className,
  children
}) => {
  return (
    <Card 
      className={cn(
        "group transition-all duration-200 hover:shadow-lg hover:scale-[1.02] cursor-pointer border-gray-200 hover:border-blue-300",
        onClick && "hover:bg-gray-50",
        className
      )}
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0 pr-4">
            <h3 className="font-semibold text-gray-900 text-lg leading-tight line-clamp-2 hover:text-primary transition-colors">
              {title}
            </h3>
            {subtitle && (
              <p className="text-sm text-gray-600 mt-1 truncate">
                {subtitle}
              </p>
            )}
          </div>
          
          <div className="flex items-center gap-2 ml-4 flex-shrink-0">
            {status && (
              <Badge 
                variant={status.variant}
                className={cn(
                  "text-xs font-medium",
                  status.color && `bg-${status.color}-100 text-${status.color}-800 border-${status.color}-200`
                )}
              >
                {status.label}
              </Badge>
            )}
            {actions && (
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                {actions}
              </div>
            )}
          </div>
        </div>
      </CardHeader>
      
      {(metadata || children) && (
        <CardContent className="pt-0">
          {metadata && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
              {metadata.map((item, index) => (
                <div key={index} className="flex items-center text-sm">
                  {item.icon && (
                    <span className="mr-2 text-gray-400">
                      {item.icon}
                    </span>
                  )}
                  <span className="text-gray-600 mr-2">{item.label}:</span>
                  <span className="font-medium text-gray-900 truncate">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          )}
          {children}
        </CardContent>
      )}
    </Card>
  );
};
