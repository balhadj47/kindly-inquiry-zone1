
import React from 'react';
import { Control } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useEmailValidation } from '@/hooks/useEmailValidation';
import { Loader2 } from 'lucide-react';

interface BasicInfoFieldsProps {
  control: Control<any>;
  isSubmitting: boolean;
  isEmployee: boolean;
  watchedEmail: string;
  onEmailValidationChange: (isValid: boolean) => void;
  userId?: string;
}

const BasicInfoFields: React.FC<BasicInfoFieldsProps> = ({
  control,
  isSubmitting,
  isEmployee,
  watchedEmail,
  onEmailValidationChange,
  userId,
}) => {
  const emailValidation = useEmailValidation(watchedEmail, !isEmployee, userId);

  React.useEffect(() => {
    onEmailValidationChange(emailValidation.isValid && !emailValidation.isChecking);
  }, [emailValidation.isValid, emailValidation.isChecking, onEmailValidationChange]);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={control}
          name="name"
          rules={{ required: 'Le nom est requis' }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nom Complet</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="ex: Jean Dupont"
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
          rules={isEmployee ? {} : { 
            required: 'L\'email est requis',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Adresse email invalide'
            }
          }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Adresse Email {!isEmployee && '*'}</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    {...field}
                    type="email"
                    placeholder="ex: jean.dupont@entreprise.com"
                    disabled={isSubmitting}
                    className={`${
                      emailValidation.error ? 'border-red-500 focus:border-red-500' : 
                      emailValidation.isValid && field.value && !emailValidation.isChecking ? 'border-green-500' : ''
                    }`}
                  />
                  {emailValidation.isChecking && (
                    <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 animate-spin text-gray-400" />
                  )}
                </div>
              </FormControl>
              {emailValidation.error && (
                <p className="text-sm font-medium text-red-500">{emailValidation.error}</p>
              )}
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={control}
        name="phone"
        rules={{ required: 'Le téléphone est requis' }}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Numéro de Téléphone</FormLabel>
            <FormControl>
              <Input
                {...field}
                placeholder="ex: +33 1 23 45 67 89"
                disabled={isSubmitting}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};

export default BasicInfoFields;
