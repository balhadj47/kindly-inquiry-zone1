
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LucideIcon } from 'lucide-react';

interface EnhancedEmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  secondaryActionLabel?: string;
  onAction?: () => void;
  onSecondaryAction?: () => void;
  illustration?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

const EnhancedEmptyState: React.FC<EnhancedEmptyStateProps> = ({
  icon: Icon,
  title,
  description,
  actionLabel,
  secondaryActionLabel,
  onAction,
  onSecondaryAction,
  illustration,
  size = 'md'
}) => {
  const sizeClasses = {
    sm: {
      container: 'py-12',
      icon: 'h-12 w-12',
      title: 'text-lg',
      description: 'text-sm',
      maxWidth: 'max-w-sm'
    },
    md: {
      container: 'py-16',
      icon: 'h-16 w-16',
      title: 'text-xl',
      description: 'text-base',
      maxWidth: 'max-w-md'
    },
    lg: {
      container: 'py-24',
      icon: 'h-20 w-20',
      title: 'text-2xl',
      description: 'text-lg',
      maxWidth: 'max-w-lg'
    }
  };

  const classes = sizeClasses[size];

  return (
    <Card className="border-border/20 shadow-sm">
      <CardContent className={`text-center ${classes.container}`}>
        <div className={`mx-auto ${classes.maxWidth} space-y-6`}>
          {/* Icon or Custom Illustration */}
          <div className="flex justify-center">
            {illustration || (
              <div className="relative">
                <div className="absolute inset-0 bg-primary/5 rounded-full blur-xl"></div>
                <div className="relative bg-primary/10 rounded-full p-6">
                  <Icon className={`${classes.icon} text-primary/60 mx-auto`} />
                </div>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="space-y-3">
            <h3 className={`font-semibold text-foreground ${classes.title}`}>
              {title}
            </h3>
            <p className={`text-muted-foreground leading-relaxed ${classes.description}`}>
              {description}
            </p>
          </div>

          {/* Actions */}
          {(onAction || onSecondaryAction) && (
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              {onAction && actionLabel && (
                <Button 
                  onClick={onAction}
                  size={size === 'sm' ? 'sm' : 'default'}
                  className="w-full sm:w-auto min-w-[120px] shadow-sm hover:shadow-md transition-all duration-200"
                >
                  {actionLabel}
                </Button>
              )}
              {onSecondaryAction && secondaryActionLabel && (
                <Button 
                  variant="outline" 
                  onClick={onSecondaryAction}
                  size={size === 'sm' ? 'sm' : 'default'}
                  className="w-full sm:w-auto min-w-[120px]"
                >
                  {secondaryActionLabel}
                </Button>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default EnhancedEmptyState;
