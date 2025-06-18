
import React from 'react';
import { Control } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

interface EmployeeFieldsProps {
  control: Control<any>;
  isSubmitting: boolean;
}

const EmployeeFields: React.FC<EmployeeFieldsProps> = ({
  control,
  isSubmitting,
}) => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={control}
          name="badgeNumber"
          rules={{ required: 'Le numéro de badge est requis' }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Numéro de Badge *</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="ex: EMP001"
                  disabled={isSubmitting}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="dateOfBirth"
          rules={{ required: 'La date de naissance est requise' }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date de Naissance *</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="date"
                  disabled={isSubmitting}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={control}
        name="placeOfBirth"
        rules={{ required: 'Le lieu de naissance est requis' }}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Lieu de Naissance *</FormLabel>
            <FormControl>
              <Input
                {...field}
                placeholder="ex: Paris, France"
                disabled={isSubmitting}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="address"
        rules={{ required: 'L\'adresse est requise' }}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Adresse *</FormLabel>
            <FormControl>
              <Input
                {...field}
                placeholder="ex: 123 Rue de la Paix, 75001 Paris"
                disabled={isSubmitting}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="driverLicense"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Permis de Conduire (optionnel)</FormLabel>
            <FormControl>
              <Input
                {...field}
                placeholder="ex: 123456789"
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

export default EmployeeFields;
