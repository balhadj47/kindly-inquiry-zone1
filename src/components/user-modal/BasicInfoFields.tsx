
import React, { useEffect } from 'react';
import { Control } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useEmailValidation } from '@/hooks/useEmailValidation';

interface BasicInfoFieldsProps {
  control: Control<any>;
  isSubmitting: boolean;
  isEmployee?: boolean;
  watchedEmail: string;
  onEmailValidationChange: (isValid: boolean) => void;
  userId?: string;
}

const BasicInfoFields: React.FC<BasicInfoFieldsProps> = ({
  control,
  isSubmitting,
  isEmployee = false,
  watchedEmail,
  onEmailValidationChange,
  userId,
}) => {
  const { isValidating, isValid, error: emailError } = useEmailValidation(watchedEmail, userId);

  useEffect(() => {
    onEmailValidationChange(isValid);
  }, [isValid, onEmailValidationChange]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormField
        control={control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nom complet *</FormLabel>
            <FormControl>
              <Input
                {...field}
                placeholder="Nom et prénom"
                disabled={isSubmitting}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Email *</FormLabel>
            <FormControl>
              <Input
                {...field}
                type="email"
                placeholder="exemple@email.com"
                disabled={isSubmitting}
              />
            </FormControl>
            {isValidating && (
              <p className="text-sm text-blue-600">Vérification de l'email...</p>
            )}
            {emailError && (
              <p className="text-sm text-red-600">{emailError}</p>
            )}
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="phone"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Téléphone</FormLabel>
            <FormControl>
              <Input
                {...field}
                type="tel"
                placeholder="+33 6 12 34 56 78"
                disabled={isSubmitting}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default BasicInfoFields;
