
import React from 'react';
import { Control } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

interface EmployeeFieldsProps {
  control: Control<any>;
  isSubmitting: boolean;
}

const EmployeeFields: React.FC<EmployeeFieldsProps> = React.memo(({
  control,
  isSubmitting,
}) => {
  const requiredFields = React.useMemo(() => ({
    badgeNumber: { required: 'Le numéro de badge est requis' },
    dateOfBirth: { required: 'La date de naissance est requise' },
    placeOfBirth: { required: 'Le lieu de naissance est requis' },
    address: { required: 'L\'adresse est requise' }
  }), []);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={control}
          name="badgeNumber"
          rules={requiredFields.badgeNumber}
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
          rules={requiredFields.dateOfBirth}
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
        rules={requiredFields.placeOfBirth}
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
        rules={requiredFields.address}
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
});

EmployeeFields.displayName = 'EmployeeFields';

export default EmployeeFields;
