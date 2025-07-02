
import React from 'react';
import { Control } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface BasicInfoSectionProps {
  control: Control<any>;
  isSubmitting: boolean;
  isEmailRequired?: boolean;
}

const BasicInfoSection: React.FC<BasicInfoSectionProps> = ({
  control,
  isSubmitting,
  isEmailRequired = false,
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Informations de base</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={control}
          name="name"
          rules={{ required: 'Le nom est requis' }}
          render={({ field }) => (
            <FormItem className="md:col-span-2">
              <FormLabel>Nom complet *</FormLabel>
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
          rules={isEmailRequired ? { 
            required: 'L\'email est requis',
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: 'Format d\'email invalide'
            }
          } : {
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: 'Format d\'email invalide'
            }
          }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email {isEmailRequired && '*'}</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="email"
                  placeholder="ex: jean.dupont@exemple.com"
                  disabled={isSubmitting}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Téléphone</FormLabel>
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
          name="status"
          render={({ field }) => (
            <FormItem className="md:col-span-2">
              <FormLabel>Statut</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger disabled={isSubmitting}>
                    <SelectValue placeholder="Sélectionner un statut" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Active">Actif</SelectItem>
                  <SelectItem value="Inactive">Inactif</SelectItem>
                  <SelectItem value="Suspended">Suspendu</SelectItem>
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
    </div>
  );
};

export default BasicInfoSection;
