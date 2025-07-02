
import React from 'react';
import { Control } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

interface DriverDetailsSectionProps {
  control: Control<any>;
  isSubmitting: boolean;
}

const DriverDetailsSection: React.FC<DriverDetailsSectionProps> = ({
  control,
  isSubmitting,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <FormField
        control={control}
        name="driverLicense"
        rules={{ required: 'Le permis de conduire est requis pour les chauffeurs' }}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Permis de Conduire *</FormLabel>
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

      <FormField
        control={control}
        name="badgeNumber"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Numéro de Badge</FormLabel>
            <FormControl>
              <Input
                {...field}
                placeholder="ex: DRV001"
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
        render={({ field }) => (
          <FormItem>
            <FormLabel>Date de Naissance</FormLabel>
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

      <FormField
        control={control}
        name="address"
        render={({ field }) => (
          <FormItem className="sm:col-span-2">
            <FormLabel>Adresse</FormLabel>
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
    </div>
  );
};

export default DriverDetailsSection;
