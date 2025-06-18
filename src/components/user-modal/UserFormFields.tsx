import React from 'react';
import { Control } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SystemGroupName } from '@/types/systemGroups';
import { useEmailValidation } from '@/hooks/useEmailValidation';
import { Loader2 } from 'lucide-react';

interface UserFormFieldsProps {
  control: Control<any>;
  isSubmitting: boolean;
  watchedRole: SystemGroupName;
  watchedEmail: string;
  onEmailValidationChange: (isValid: boolean) => void;
}

const UserFormFields: React.FC<UserFormFieldsProps> = ({
  control,
  isSubmitting,
  watchedRole,
  watchedEmail,
  onEmailValidationChange,
}) => {
  const isEmployee = watchedRole === 'Employee';
  const emailValidation = useEmailValidation(watchedEmail, !isEmployee);

  React.useEffect(() => {
    onEmailValidationChange(emailValidation.isValid && !emailValidation.isChecking);
  }, [emailValidation.isValid, emailValidation.isChecking, onEmailValidationChange]);

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
          rules={isEmployee ? {} : { 
            required: 'L\'email est requis',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Adresse email invalide'
            }
          }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Adresse Email {!isEmployee && '*'}</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    {...field}
                    type="email"
                    placeholder="ex: jean.dupont@entreprise.com"
                    disabled={isSubmitting}
                    className={`${
                      emailValidation.error ? 'border-red-500 focus:border-red-500' : 
                      emailValidation.isValid && field.value && !emailValidation.isChecking ? 'border-green-500' : ''
                    }`}
                  />
                  {emailValidation.isChecking && (
                    <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 animate-spin text-gray-400" />
                  )}
                </div>
              </FormControl>
              {emailValidation.error && (
                <p className="text-sm font-medium text-red-500">{emailValidation.error}</p>
              )}
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

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

      {/* Employee-specific fields - only show for Employee role */}
      {isEmployee && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={control}
              name="badgeNumber"
              rules={{ required: 'Le numéro de badge est requis' }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Numéro de Badge *</FormLabel>
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
              rules={{ required: 'La date de naissance est requise' }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date de Naissance *</FormLabel>
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
            rules={{ required: 'Le lieu de naissance est requis' }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Lieu de Naissance *</FormLabel>
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
            rules={{ required: 'L\'adresse est requise' }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Adresse *</FormLabel>
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

          <FormField
            control={control}
            name="driverLicense"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Permis de Conduire (optionnel)</FormLabel>
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
        </>
      )}
    </>
  );
};

export default UserFormFields;
