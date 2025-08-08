
import React from 'react';
import { Control } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

interface PersonalInfoSectionProps {
  control: Control<any>;
  isSubmitting: boolean;
}

const PersonalInfoSection: React.FC<PersonalInfoSectionProps> = ({
  control,
  isSubmitting,
}) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Informations de Base</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={control}
            name="name"
            rules={{ required: 'Le nom est requis' }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nom Complet *</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Nom et prénom"
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
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="email"
                    placeholder="email@exemple.com"
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
                    type="tel"
                    placeholder="+33 6 12 34 56 78"
                    disabled={isSubmitting}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

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
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Adresse et Documents d'Identité</h3>
        <div className="space-y-4">
          <FormField
            control={control}
            name="address"
            rules={{ required: 'L\'adresse est requise' }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Adresse Complète *</FormLabel>
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={control}
              name="identificationNational"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Numéro d'Identité Nationale</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="ex: 1234567890123"
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="carteNational"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Carte Nationale</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="ex: CN123456789"
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="carteNationalStartDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date d'Émission Carte Nationale</FormLabel>
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
              name="carteNationalExpiryDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date d'Expiration Carte Nationale</FormLabel>
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
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Affectation Entreprise</h3>
        <FormField
          control={control}
          name="companyAssignmentDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date d'Affectation</FormLabel>
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

export default PersonalInfoSection;
