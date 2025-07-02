
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { DialogFooter } from '@/components/ui/dialog';
import { User, UserStatus } from '@/types/rbac';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, User as UserIcon, IdCard, Car, Heart } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
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
  // New fields from other tabs
  identificationNational?: string;
  carteNational?: string;
  carteNationalStartDate?: string;
  carteNationalExpiryDate?: string;
  driverLicenseStartDate?: string;
  driverLicenseExpiryDate?: string;
  driverLicenseCategory?: string[];
  driverLicenseCategoryDates?: Record<string, { start?: string; expiry?: string }>;
  bloodType?: string;
  companyAssignmentDate?: string;
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
      // New fields with proper mapping
      identificationNational: extractStringValue((employee as any)?.identification_national) || '',
      carteNational: extractStringValue((employee as any)?.carte_national) || '',
      carteNationalStartDate: extractStringValue((employee as any)?.carte_national_start_date) || '',
      carteNationalExpiryDate: extractStringValue((employee as any)?.carte_national_expiry_date) || '',
      driverLicenseStartDate: extractStringValue((employee as any)?.driver_license_start_date) || '',
      driverLicenseExpiryDate: extractStringValue((employee as any)?.driver_license_expiry_date) || '',
      driverLicenseCategory: (employee as any)?.driver_license_category || [],
      driverLicenseCategoryDates: (employee as any)?.driver_license_category_dates || {},
      bloodType: extractStringValue((employee as any)?.blood_type) || '',
      companyAssignmentDate: extractStringValue((employee as any)?.company_assignment_date) || '',
    },
  });

  const handleSubmit = async (data: FormData) => {
    try {
      setSubmitError(null);
      console.log('🔍 EmployeeModalForm - Raw form data:', data);
      
      // Clean and prepare the data for submission - include ALL fields
      const submitData = {
        name: data.name?.trim() || '',
        email: data.email?.trim() || undefined,
        phone: data.phone?.trim() || undefined,
        status: data.status,
        // Handle profileImage explicitly - preserve empty string for removal
        profileImage: typeof data.profileImage === 'string' ? data.profileImage : undefined,
        badgeNumber: data.badgeNumber?.trim() || undefined,
        dateOfBirth: data.dateOfBirth?.trim() || undefined,
        placeOfBirth: data.placeOfBirth?.trim() || undefined,
        address: data.address?.trim() || undefined,
        driverLicense: data.driverLicense?.trim() || undefined,
        role_id: 3, // Employee role
        // Map form data to proper field names for database
        identification_national: data.identificationNational?.trim() || undefined,
        carte_national: data.carteNational?.trim() || undefined,
        carte_national_start_date: data.carteNationalStartDate?.trim() || undefined,
        carte_national_expiry_date: data.carteNationalExpiryDate?.trim() || undefined,
        driver_license_start_date: data.driverLicenseStartDate?.trim() || undefined,
        driver_license_expiry_date: data.driverLicenseExpiryDate?.trim() || undefined,
        driver_license_category: data.driverLicenseCategory || [],
        driver_license_category_dates: data.driverLicenseCategoryDates || {},
        blood_type: data.bloodType?.trim() || undefined,
        company_assignment_date: data.companyAssignmentDate?.trim() || undefined,
      };
      
      console.log('🚀 EmployeeModalForm - Final submit data:', submitData);
      console.log('🖼️ EmployeeModalForm - ProfileImage value:', JSON.stringify(submitData.profileImage));
      
      await onSubmit(submitData);
      console.log('✅ EmployeeModalForm - Form submitted successfully');
      form.reset();
    } catch (error) {
      console.error('❌ EmployeeModalForm - Error submitting form:', error);
      
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

  const handleImageChange = (url: string) => {
    console.log('🖼️ EmployeeModalForm - Image changed to:', JSON.stringify(url));
    form.setValue('profileImage', url);
    
    // Force form to re-render by triggering a change
    form.trigger('profileImage');
  };

  const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  const driverLicenseCategories = ['A', 'A1', 'A2', 'B', 'BE', 'C', 'C1', 'CE', 'C1E', 'D', 'D1', 'DE', 'D1E'];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        {/* Error Alert */}
        {submitError && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{submitError}</AlertDescription>
          </Alert>
        )}

        {/* Profile Image Section */}
        <div className="bg-muted/30 rounded-lg p-4 border border-border/50">
          <EmployeeImageUpload
            profileImage={form.watch('profileImage') || ''}
            userName={form.watch('name')}
            onImageChange={handleImageChange}
            isSubmitting={isSubmitting}
          />
        </div>

        {/* Tabbed Interface */}
        <TooltipProvider>
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full h-10 p-1 bg-muted/50 border border-border/50 grid-cols-4">
              <Tooltip>
                <TooltipTrigger asChild>
                  <TabsTrigger 
                    value="basic" 
                    className="flex items-center justify-center py-2 px-2 data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all duration-200"
                  >
                    <UserIcon className="h-3.5 w-3.5 text-blue-600" />
                  </TabsTrigger>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Informations de base</p>
                </TooltipContent>
              </Tooltip>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <TabsTrigger 
                    value="identity"
                    className="flex items-center justify-center py-2 px-2 data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all duration-200"
                  >
                    <IdCard className="h-3.5 w-3.5 text-purple-600" />
                  </TabsTrigger>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Documents d'identité</p>
                </TooltipContent>
              </Tooltip>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <TabsTrigger 
                    value="driver"
                    className="flex items-center justify-center py-2 px-2 data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all duration-200"
                  >
                    <Car className="h-3.5 w-3.5 text-green-600" />
                  </TabsTrigger>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Permis de conduire</p>
                </TooltipContent>
              </Tooltip>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <TabsTrigger 
                    value="medical"
                    className="flex items-center justify-center py-2 px-2 data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all duration-200"
                  >
                    <Heart className="h-3.5 w-3.5 text-red-500" />
                  </TabsTrigger>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Informations médicales</p>
                </TooltipContent>
              </Tooltip>
            </TabsList>
            
            {/* Basic Info Tab */}
            <TabsContent value="basic" className="mt-4 bg-card/50 rounded-lg p-3 sm:p-4 border border-border/50 space-y-4">
              <FormField
                control={form.control}
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
                  control={form.control}
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
                  control={form.control}
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
                control={form.control}
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
                control={form.control}
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
            </TabsContent>
            
            {/* Identity Documents Tab */}
            <TabsContent value="identity" className="mt-4 bg-card/50 rounded-lg p-3 sm:p-4 border border-border/50 space-y-4">
              <h3 className="text-lg font-medium">Documents d'identité</h3>
              
              <FormField
                control={form.control}
                name="identificationNational"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Numéro d'identification nationale</FormLabel>
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
                control={form.control}
                name="carteNational"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Numéro de carte nationale</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="ex: AB123456"
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="carteNationalStartDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date de délivrance</FormLabel>
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
                  control={form.control}
                  name="carteNationalExpiryDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date d'expiration</FormLabel>
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
            </TabsContent>
            
            {/* Driver License Tab */}
            <TabsContent value="driver" className="mt-4 bg-card/50 rounded-lg p-3 sm:p-4 border border-border/50 space-y-4">
              <h3 className="text-lg font-medium">Permis de conduire</h3>
              
              <FormField
                control={form.control}
                name="driverLicense"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Numéro de permis</FormLabel>
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="driverLicenseStartDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date de délivrance</FormLabel>
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
                  control={form.control}
                  name="driverLicenseExpiryDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date d'expiration</FormLabel>
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
            </TabsContent>
            
            {/* Medical Info Tab */}
            <TabsContent value="medical" className="mt-4 bg-card/50 rounded-lg p-3 sm:p-4 border border-border/50 space-y-4">
              <h3 className="text-lg font-medium">Informations médicales</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
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
                  control={form.control}
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
            </TabsContent>
          </Tabs>
        </TooltipProvider>

        <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-0 sm:space-x-2 pt-6 mt-6 border-t border-border/50">
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
