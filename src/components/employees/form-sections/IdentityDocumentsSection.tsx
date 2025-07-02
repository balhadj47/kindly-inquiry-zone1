
import React from 'react';
import { Control } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

interface IdentityDocumentsSectionProps {
  control: Control<any>;
  isSubmitting: boolean;
}

const IdentityDocumentsSection: React.FC<IdentityDocumentsSectionProps> = ({
  control,
  isSubmitting,
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Documents d'identité</h3>
      
      <FormField
        control={control}
        name="identificationNational"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Numéro d'identification nationale</FormLabel>
            <FormControl>
              <Input
                {...field}
                placeholder="ex: 1234567890123"
                disabled={isSubmitting}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="carteNational"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Numéro de carte nationale</FormLabel>
            <FormControl>
              <Input
                {...field}
                placeholder="ex: AB123456"
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
          name="carteNationalStartDate"
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
          name="carteNationalExpiryDate"
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

export default IdentityDocumentsSection;
