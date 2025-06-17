
import React from 'react';
import { Control } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SystemGroupName } from '@/types/systemGroups';

interface UserFormFieldsProps {
  control: Control<any>;
  isSubmitting: boolean;
  watchedRole: SystemGroupName;
}

const UserFormFields: React.FC<UserFormFieldsProps> = ({
  control,
  isSubmitting,
  watchedRole,
}) => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={control}
          name="name"
          rules={{ required: 'Le nom est requis' }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nom Complet</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="ex: Jean Dupont"
                  disabled={isSubmitting}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="email"
          rules={{ 
            required: 'L\'email est requis',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Adresse email invalide'
            }
          }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Adresse Email</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="email"
                  placeholder="ex: jean.dupont@entreprise.com"
                  disabled={isSubmitting}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={control}
          name="phone"
          rules={{ required: 'Le téléphone est requis' }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Numéro de Téléphone</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="ex: +33 1 23 45 67 89"
                  disabled={isSubmitting}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

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
      </div>

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
    </>
  );
};

export default UserFormFields;
