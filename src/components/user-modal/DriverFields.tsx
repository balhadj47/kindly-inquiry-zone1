
import React from 'react';
import { Control } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

interface DriverFieldsProps {
  control: Control<any>;
  isSubmitting: boolean;
}

const DriverFields: React.FC<DriverFieldsProps> = ({ control, isSubmitting }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <FormField
        control={control}
        name="licenseNumber"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Numéro de Permis</FormLabel>
            <FormControl>
              <Input
                {...field}
                placeholder="ex: DL123456789"
                disabled={isSubmitting}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="totalTrips"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Total des Voyages</FormLabel>
            <FormControl>
              <Input
                {...field}
                type="number"
                min="0"
                placeholder="0"
                disabled={isSubmitting}
                onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="lastTrip"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Dernier Voyage</FormLabel>
            <FormControl>
              <Input
                {...field}
                placeholder="ex: 2024-01-15"
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

export default DriverFields;
