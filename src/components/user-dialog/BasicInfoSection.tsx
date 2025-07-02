
import React from 'react';
import { Control } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

interface BasicInfoSectionProps {
  control: Control<any>;
  isSubmitting: boolean;
  isEmailRequired?: boolean;
}

const BasicInfoSection: React.FC<BasicInfoSectionProps> = ({ 
  control, 
  isSubmitting,
  isEmailRequired = false
}) => {
  return (
    <>
      <FormField
        control={control}
        name="name"
        rules={{ required: 'Le nom est requis' }}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nom complet *</FormLabel>
            <FormControl>
              <Input
                placeholder="Nom et prénom"
                disabled={isSubmitting}
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="email"
        rules={isEmailRequired ? {
          required: 'L\'email est requis pour créer un compte d\'authentification',
          pattern: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            message: 'Format d\'email invalide'
          }
        } : {
          pattern: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            message: 'Format d\'email invalide'
          }
        }}
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Email {isEmailRequired && '*'}
              {isEmailRequired && (
                <span className="text-xs text-gray-500 ml-1">(requis pour l'authentification)</span>
              )}
            </FormLabel>
            <FormControl>
              <Input
                type="email"
                placeholder="utilisateur@exemple.com"
                disabled={isSubmitting}
                {...field}
                value={field.value || ''}
              />
            </FormControl>
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
                type="tel"
                placeholder="+33 6 12 34 56 78"
                disabled={isSubmitting}
                {...field}
                value={field.value || ''}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};

export default BasicInfoSection;
