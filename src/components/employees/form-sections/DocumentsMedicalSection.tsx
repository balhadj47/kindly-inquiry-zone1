
import React from 'react';
import { Control } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface DocumentsMedicalSectionProps {
  control: Control<any>;
  isSubmitting: boolean;
}

const DocumentsMedicalSection: React.FC<DocumentsMedicalSectionProps> = ({
  control,
  isSubmitting,
}) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Permis de Conduire</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={control}
            name="driverLicense"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Numéro de Permis</FormLabel>
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
            name="driverLicenseCategory"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Catégories de Permis</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="ex: B, C, D"
                    disabled={isSubmitting}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="driverLicenseStartDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date d'Obtention</FormLabel>
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
                <FormLabel>Date d'Expiration</FormLabel>
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

      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Informations Médicales</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={control}
            name="bloodType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Groupe Sanguin</FormLabel>
                <Select onValueChange={field.onChange} value={field.value} disabled={isSubmitting}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner le groupe sanguin" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="A+">A+</SelectItem>
                    <SelectItem value="A-">A-</SelectItem>
                    <SelectItem value="B+">B+</SelectItem>
                    <SelectItem value="B-">B-</SelectItem>
                    <SelectItem value="AB+">AB+</SelectItem>
                    <SelectItem value="AB-">AB-</SelectItem>
                    <SelectItem value="O+">O+</SelectItem>
                    <SelectItem value="O-">O-</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
    </div>
  );
};

export default DocumentsMedicalSection;
