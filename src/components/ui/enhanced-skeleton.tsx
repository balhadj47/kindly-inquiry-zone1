
import { cn } from "@/lib/utils"

interface EnhancedSkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'card' | 'text' | 'avatar' | 'button';
  size?: 'sm' | 'md' | 'lg';
}

function EnhancedSkeleton({
  className,
  variant = 'default',
  size = 'md',
  ...props
}: EnhancedSkeletonProps) {
  const baseClasses = "animate-pulse rounded-md bg-gradient-to-r from-muted via-muted/50 to-muted";
  
  const variantClasses = {
    default: "",
    card: "shadow-sm border border-border/10",
    text: "rounded-sm",
    avatar: "rounded-full",
    button: "rounded-lg"
  };

  const sizeClasses = {
    sm: "h-3",
    md: "h-4", 
    lg: "h-6"
  };

  return (
    <div
      className={cn(
        baseClasses,
        variantClasses[variant],
        variant !== 'card' && sizeClasses[size],
        className
      )}
      {...props}
    />
  )
}

export { EnhancedSkeleton }
