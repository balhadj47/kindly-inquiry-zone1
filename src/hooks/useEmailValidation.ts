
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useDebounce } from './useDebounce';

interface EmailValidationResult {
  isChecking: boolean;
  isValid: boolean;
  isDuplicate: boolean;
  error: string | null;
}

export const useEmailValidation = (email: string, isRequired: boolean = true, excludeUserId?: string) => {
  const [result, setResult] = useState<EmailValidationResult>({
    isChecking: false,
    isValid: true,
    isDuplicate: false,
    error: null,
  });

  const debouncedEmail = useDebounce(email, 500);

  const checkEmail = useCallback(async (emailToCheck: string) => {
    if (!emailToCheck || emailToCheck.trim() === '') {
      if (isRequired) {
        setResult({
          isChecking: false,
          isValid: false,
          isDuplicate: false,
          error: 'L\'email est requis',
        });
      } else {
        setResult({
          isChecking: false,
          isValid: true,
          isDuplicate: false,
          error: null,
        });
      }
      return;
    }

    // Basic email format validation
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    if (!emailRegex.test(emailToCheck)) {
      setResult({
        isChecking: false,
        isValid: false,
        isDuplicate: false,
        error: 'Format d\'email invalide',
      });
      return;
    }

    setResult(prev => ({ ...prev, isChecking: true }));

    try {
      let query = supabase
        .from('users')
        .select('id')
        .eq('email', emailToCheck.trim());

      // If we're editing a user, exclude their current record from the check
      if (excludeUserId) {
        query = query.neq('id', parseInt(excludeUserId));
      }

      const { data, error } = await query.limit(1);

      if (error) {
        console.error('Error checking email:', error);
        setResult({
          isChecking: false,
          isValid: false,
          isDuplicate: false,
          error: 'Erreur lors de la vérification de l\'email',
        });
        return;
      }

      const isDuplicate = data && data.length > 0;
      setResult({
        isChecking: false,
        isValid: !isDuplicate,
        isDuplicate,
        error: isDuplicate ? 'Cet email est déjà utilisé' : null,
      });
    } catch (error) {
      console.error('Error checking email:', error);
      setResult({
        isChecking: false,
        isValid: false,
        isDuplicate: false,
        error: 'Erreur lors de la vérification de l\'email',
      });
    }
  }, [isRequired, excludeUserId]);

  useEffect(() => {
    checkEmail(debouncedEmail);
  }, [debouncedEmail, checkEmail]);

  return result;
};
