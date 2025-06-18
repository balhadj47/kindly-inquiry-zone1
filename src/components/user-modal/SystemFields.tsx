
import React from 'react';
import { Control } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface SystemFieldsProps {
  control: Control<any>;
  isSubmitting: boolean;
}

const SystemFields: React.FC<SystemFieldsProps> = ({
  control,
  isSubmitting,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormField
        control={control}
        name="systemGroup"
        rules={{ required: 'Le groupe système est requis' }}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Groupe Système</FormLabel>
            <Select onValueChange={field.onChange} value={field.value} disabled={isSubmitting}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un groupe" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="Administrator">Administrateur</SelectItem>
                <SelectItem value="Supervisor">Superviseur</SelectItem>
                <SelectItem value="Employee">Employé</SelectItem>
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
                <SelectItem value="Active">Actif</SelectItem>
                <SelectItem value="Récupération">Récupération</SelectItem>
                <SelectItem value="Congé">Congé</SelectItem>
                <SelectItem value="Congé maladie">Congé maladie</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default SystemFields;
