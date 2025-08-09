
import React from 'react';
import { Control } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

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
    <div className="space-y-6">
      <div className="border-b border-border/50 pb-4">
        <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
          ❤️ Informations médicales
        </h3>
        <p className="text-sm text-muted-foreground mt-1">
          Informations médicales de l'employé
        </p>
      </div>

      <div className="bg-muted/20 rounded-lg p-4 border border-border/30">
        <FormField
          control={control}
          name="bloodType"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium">Groupe sanguin</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                disabled={isSubmitting}
              >
                <FormControl>
                  <SelectTrigger className="transition-all duration-200 focus:ring-2 focus:ring-primary/20">
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
      </div>
    </div>
  );
};

export default MedicalInfoSection;
