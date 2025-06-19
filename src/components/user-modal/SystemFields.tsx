
import React from 'react';
import { Control } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface SystemFieldsProps {
  control: Control<any>;
  isSubmitting: boolean;
}

const SystemFields: React.FC<SystemFieldsProps> = React.memo(({
  control,
  isSubmitting,
}) => {
  const roleOptions = React.useMemo(() => [
    { value: 1, label: "Administrateur" },
    { value: 2, label: "Superviseur" },
    { value: 3, label: "Employé" }
  ], []);

  const statusOptions = React.useMemo(() => [
    { value: "Active", label: "Actif" },
    { value: "Récupération", label: "Récupération" },
    { value: "Congé", label: "Congé" },
    { value: "Congé maladie", label: "Congé maladie" }
  ], []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormField
        control={control}
        name="role_id"
        rules={{ required: 'Le rôle est requis' }}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Rôle</FormLabel>
            <Select 
              onValueChange={(value) => field.onChange(parseInt(value))} 
              value={field.value?.toString()} 
              disabled={isSubmitting}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un rôle" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {roleOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value.toString()}>
                    {option.label}
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
        name="status"
        rules={{ required: 'Le statut est requis' }}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Statut</FormLabel>
            <Select onValueChange={field.onChange} value={field.value} disabled={isSubmitting}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un statut" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {statusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
});

SystemFields.displayName = 'SystemFields';

export default SystemFields;
