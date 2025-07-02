
import React from 'react';
import { Control } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

interface DriverLicenseSectionProps {
  control: Control<any>;
  isSubmitting: boolean;
}

const DriverLicenseSection: React.FC<DriverLicenseSectionProps> = ({
  control,
  isSubmitting,
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Permis de conduire</h3>
      
      <FormField
        control={control}
        name="driverLicense"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Numéro de permis</FormLabel>
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={control}
          name="driverLicenseStartDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date de délivrance</FormLabel>
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
          name="driverLicenseExpiryDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date d'expiration</FormLabel>
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
    </div>
  );
};

export default DriverLicenseSection;
