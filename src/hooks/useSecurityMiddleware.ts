
import { useAuth } from '@/contexts/AuthContext';
import { useRBAC } from '@/contexts/RBACContext';
import { useToast } from '@/hooks/use-toast';
import { useCallback } from 'react';

export const useSecurityMiddleware = () => {
  const { user } = useAuth();
  const { hasPermission } = useRBAC();
  const { toast } = useToast();

  const requireAuth = useCallback((callback: () => void) => {
    if (!user) {
      toast({
        title: 'Authentication Required',
        description: 'You must be logged in to perform this action',
        variant: 'destructive',
      });
      return;
    }
    callback();
  }, [user, toast]);

  const requirePermission = useCallback((permission: string, callback: () => void) => {
    if (!user) {
      toast({
        title: 'Authentication Required',
        description: 'You must be logged in to perform this action',
        variant: 'destructive',
      });
      return;
    }

    if (!hasPermission(permission)) {
      toast({
        title: 'Access Denied',
        description: 'You do not have permission to perform this action',
        variant: 'destructive',
      });
      return;
    }

    callback();
  }, [user, hasPermission, toast]);

  const requireOwnershipOrPermission = useCallback((
    ownerId: string,
    permission: string,
    callback: () => void
  ) => {
    if (!user) {
      toast({
        title: 'Authentication Required',
        description: 'You must be logged in to perform this action',
        variant: 'destructive',
      });
      return;
    }

    const isOwner = user.id === ownerId;
    const hasRequiredPermission = hasPermission(permission);

    if (!isOwner && !hasRequiredPermission) {
      toast({
        title: 'Access Denied',
        description: 'You can only modify your own data or need admin permissions',
        variant: 'destructive',
      });
      return;
    }

    callback();
  }, [user, hasPermission, toast]);

  const validateInput = useCallback(<T>(
    data: T,
    validator: (data: T) => boolean,
    errorMessage: string = 'Invalid input data'
  ): boolean => {
    if (!validator(data)) {
      toast({
        title: 'Validation Error',
        description: errorMessage,
        variant: 'destructive',
      });
      return false;
    }
    return true;
  }, [toast]);

  const rateLimitCheck = useCallback((
    key: string,
    maxAttempts: number = 5,
    windowMs: number = 60000
  ): boolean => {
    const now = Date.now();
    const attempts = JSON.parse(localStorage.getItem(`rate_limit_${key}`) || '[]');
    
    // Filter out old attempts
    const recentAttempts = attempts.filter((time: number) => now - time < windowMs);
    
    if (recentAttempts.length >= maxAttempts) {
      toast({
        title: 'Rate Limit Exceeded',
        description: 'Too many attempts. Please try again later.',
        variant: 'destructive',
      });
      return false;
    }

    // Add current attempt
    recentAttempts.push(now);
    localStorage.setItem(`rate_limit_${key}`, JSON.stringify(recentAttempts));
    
    return true;
  }, [toast]);

  return {
    requireAuth,
    requirePermission,
    requireOwnershipOrPermission,
    validateInput,
    rateLimitCheck,
    isAuthenticated: !!user,
  };
};
