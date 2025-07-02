
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { DialogFooter } from '@/components/ui/dialog';
import { User, UserStatus } from '@/types/rbac';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';
import EmployeeImageUpload from './EmployeeImageUpload';

interface EmployeeModalFormProps {
  employee?: User | null;
  onSubmit: (userData: Partial<User>) => Promise<void>;
  isSubmitting: boolean;
  onCancel: () => void;
}

interface FormData {
  name: string;
  phone: string;
  status: UserStatus;
  badgeNumber: string;
  dateOfBirth: string;
  placeOfBirth: string;
  address: string;
  driverLicense?: string;
  profileImage?: string;
  email?: string;
}

// Helper function to safely extract string values
const extractStringValue = (value: any): string | undefined => {
  if (value === null || value === undefined) return undefined;
  if (typeof value === 'string') return value;
  if (typeof value === 'object' && value !== null && 'value' in value) {
    return typeof value.value === 'string' ? value.value : undefined;
  }
  return undefined;
};

const EmployeeModalForm: React.FC<EmployeeModalFormProps> = ({
  employee,
  onSubmit,
  isSubmitting,
  onCancel,
}) => {
  const [submitError, setSubmitError] = useState<string | null>(null);

  const form = useForm<FormData>({
    defaultValues: {
      name: employee?.name || '',
      phone: employee?.phone || '',
      status: employee?.status || 'Active',
      badgeNumber: extractStringValue(employee?.badgeNumber) || '',
      dateOfBirth: extractStringValue(employee?.dateOfBirth) || '',
      placeOfBirth: extractStringValue(employee?.placeOfBirth) || '',
      address: extractStringValue(employee?.address) || '',
      driverLicense: extractStringValue(employee?.driverLicense) || '',
      profileImage: extractStringValue(employee?.profileImage) || '',
      email: extractStringValue(employee?.email) || '',
    },
  });

  const handleSubmit = async (data: FormData) => {
    try {
      setSubmitError(null);
      console.log('Submitting employee form with data:', data);
      
      // Safely handle profile image - ensure it's a string or undefined
      const profileImageValue = data.profileImage;
      let finalProfileImageValue: string | undefined = undefined;
      
      if (profileImageValue) {
        if (typeof profileImageValue === 'string') {
          finalProfileImageValue = profileImageValue;
        } else if (typeof profileImageValue === 'object' && profileImageValue !== null && 'value' in profileImageValue) {
          const extractedValue = (profileImageValue as any).value;
          finalProfileImageValue = typeof extractedValue === 'string' ? extractedValue : undefined;
        }
      }
      
      // Convert empty strings to undefined/null for optional fields and ensure proper types
      const submitData = {
        name: data.name?.trim() || '',
        email: data.email?.trim() || undefined,
        phone: data.phone?.trim() || undefined,
        status: data.status,
        profileImage: finalProfileImageValue,
        badgeNumber: data.badgeNumber?.trim() || undefined,
        dateOfBirth: data.dateOfBirth?.trim() || undefined,
        placeOfBirth: data.placeOfBirth?.trim() || undefined,
        address: data.address?.trim() || undefined,
        driverLicense: data.driverLicense?.trim() || undefined,
        role_id: 3, // Employee role
      };
      
      console.log('Final employee submit data:', submitData);
      
      await onSubmit(submitData);
      console.log('Employee form submitted successfully');
      form.reset();
    } catch (error) {
      console.error('Error submitting employee form:', error);
      
      if (error instanceof Error) {
        if (error.message.includes('duplicate key') || error.message.includes('unique constraint')) {
          if (error.message.includes('email')) {
            setSubmitError('Cette adresse email est déjà utilisée par un autre utilisateur. Veuillez utiliser une adresse email différente ou laisser le champ vide.');
          } else {
            setSubmitError('Cette valeur est déjà utilisée. Veuillez en choisir une autre.');
          }
        } else if (error.message.includes('permission')) {
          setSubmitError('Vous n\'avez pas les permissions nécessaires pour effectuer cette action.');
        } else {
          setSubmitError(`Erreur: ${error.message}`);
        }
      } else {
        setSubmitError('Une erreur inattendue s\'est produite. Veuillez réessayer.');
      }
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {/* Error Alert */}
        {submitError && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{submitError}</AlertDescription>
          </Alert>
        )}

        <div className="flex justify-center">
          <EmployeeImageUpload
            profileImage={form.watch('profileImage') || ''}
            userName={form.watch('name')}
            onImageChange={(url) => form.setValue('profileImage', url)}
            isSubmitting={isSubmitting}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="name"
            rules={{ required: 'Le nom est requis' }}
            render={({ field }) => (
              <FormItem className="sm:col-span-2">
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
            control={form.control}
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
            control={form.control}
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
            control={form.control}
            name="badgeNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium">Numéro de Badge (optionnel)</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="ex: EMP001"
                    disabled={isSubmitting}
                    className="w-full"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
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

          <FormField
            control={form.control}
            name="dateOfBirth"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium">Date de Naissance (optionnel)</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="date"
                    disabled={isSubmitting}
                    className="w-full"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="driverLicense"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium">Permis de Conduire (optionnel)</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="ex: 123456789"
                    disabled={isSubmitting}
                    className="w-full"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="placeOfBirth"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium">Lieu de Naissance (optionnel)</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="ex: Paris, France"
                  disabled={isSubmitting}
                  className="w-full"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium">Adresse (optionnel)</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="ex: 123 Rue de la Paix, 75001 Paris"
                  disabled={isSubmitting}
                  className="w-full"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-0 sm:space-x-2 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setSubmitError(null);
              onCancel();
            }}
            disabled={isSubmitting}
            className="w-full sm:w-auto"
          >
            Annuler
          </Button>
          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full sm:w-auto"
          >
            {isSubmitting ? 'Enregistrement...' : employee ? 'Modifier' : 'Créer'}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

export default EmployeeModalForm;
