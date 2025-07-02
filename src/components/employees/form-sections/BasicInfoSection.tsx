
import React from 'react';
import { Control } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface BasicInfoSectionProps {
  control: Control<any>;
  isSubmitting: boolean;
}

const BasicInfoSection: React.FC<BasicInfoSectionProps> = ({
  control,
  isSubmitting,
}) => {
  return (
    <div className="space-y-4">
      <FormField
        control={control}
        name="name"
        rules={{ required: 'Le nom est requis' }}
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm font-medium">Nom complet *</FormLabel>
            <FormControl>
              <Input
                {...field}
                placeholder="ex: Jean Dupont"
                disabled={isSubmitting}
                className="w-full"
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
          pattern: {
            value: /^$|^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: 'Format d\'email invalide'
          }
        }}
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm font-medium">Email (optionnel)</FormLabel>
            <FormControl>
              <Input
                {...field}
                type="email"
                placeholder="ex: jean.dupont@exemple.com"
                disabled={isSubmitting}
                className="w-full"
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
            <FormLabel className="text-sm font-medium">Téléphone (optionnel)</FormLabel>
            <FormControl>
              <Input
                {...field}
                placeholder="ex: +33 1 23 45 67 89"
                disabled={isSubmitting}
                className="w-full"
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
          <FormItem>
            <FormLabel className="text-sm font-medium">Statut</FormLabel>
            <Select 
              onValueChange={field.onChange} 
              value={field.value}
              disabled={isSubmitting}
            >
              <FormControl>
                <SelectTrigger className="w-full">
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={control}
          name="badgeNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium">Numéro de Badge</FormLabel>
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
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium">Date de Naissance</FormLabel>
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
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm font-medium">Lieu de Naissance</FormLabel>
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
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm font-medium">Adresse</FormLabel>
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
    </div>
  );
};

export default BasicInfoSection;
