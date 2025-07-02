
import React from 'react';
import { Control } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';

interface MedicalInfoSectionProps {
  control: Control<any>;
  isSubmitting: boolean;
}

const MedicalInfoSection: React.FC<MedicalInfoSectionProps> = ({
  control,
  isSubmitting,
}) => {
  const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Informations médicales</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={control}
          name="bloodType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Groupe sanguin</FormLabel>
              <Select onValueChange={field.onChange} value={field.value} disabled={isSubmitting}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un groupe sanguin" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {bloodTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="companyAssignmentDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date d'affectation à l'entreprise</FormLabel>
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

export default MedicalInfoSection;
