
import { useState, useEffect, useCallback } from 'react';
import { useRBAC } from '@/contexts/RBACContext';
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

  const { users } = useRBAC();
  const debouncedEmail = useDebounce(email, 500);

  const checkEmail = useCallback((emailToCheck: string) => {
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

    // Check for duplicates in the users list
    const isDuplicate = users.some(user => {
      // Skip the current user if we're editing
      if (excludeUserId && user.id === excludeUserId) {
        return false;
      }
      return user.email && user.email.toLowerCase() === emailToCheck.toLowerCase().trim();
    });

    setResult({
      isChecking: false,
      isValid: !isDuplicate,
      isDuplicate,
      error: isDuplicate ? 'Cet email est déjà utilisé' : null,
    });
  }, [users, isRequired, excludeUserId]);

  useEffect(() => {
    checkEmail(debouncedEmail);
  }, [debouncedEmail, checkEmail]);

  return result;
};
