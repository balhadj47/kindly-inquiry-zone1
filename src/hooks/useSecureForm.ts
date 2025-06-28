
import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { validateAndSanitize } from '@/utils/inputValidation';
import { secureDataHandler } from '@/utils/secureDataHandler';
import { z } from 'zod';

interface UseSecureFormOptions<T> {
  schema: z.ZodSchema<T>;
  onSuccess?: (data: T) => void;
  onError?: (errors: string[]) => void;
  auditAction?: string;
}

export const useSecureForm = <T>({
  schema,
  onSuccess,
  onError,
  auditAction
}: UseSecureFormOptions<T>) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const { toast } = useToast();

  const validateAndSubmit = useCallback(async (
    data: unknown,
    submitFn?: (validatedData: T) => Promise<void>
  ) => {
    setIsSubmitting(true);
    setErrors([]);

    try {
      // Validate and sanitize input
      const validation = validateAndSanitize(schema, data);
      
      if (!validation.success) {
        setErrors(validation.errors || ['Validation failed']);
        onError?.(validation.errors || ['Validation failed']);
        
        toast({
          title: 'Validation Error',
          description: validation.errors?.[0] || 'Please check your input',
          variant: 'destructive',
        });
        return;
      }

      // Audit log the action
      if (auditAction) {
        await secureDataHandler.auditLog(auditAction, {
          action: 'form_submit',
          data_keys: Object.keys(validation.data as any)
        });
      }

      // Execute submit function if provided
      if (submitFn) {
        await submitFn(validation.data);
      }

      onSuccess?.(validation.data);
      
      toast({
        title: 'Success',
        description: 'Form submitted successfully',
      });

    } catch (error) {
      console.error('Form submission error:', error);
      const errorMessage = error instanceof Error ? error.message : 'An error occurred';
      
      setErrors([errorMessage]);
      onError?.([errorMessage]);
      
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [schema, onSuccess, onError, auditAction, toast]);

  const reset = useCallback(() => {
    setErrors([]);
    setIsSubmitting(false);
  }, []);

  return {
    validateAndSubmit,
    isSubmitting,
    errors,
    reset,
    hasErrors: errors.length > 0,
  };
};
