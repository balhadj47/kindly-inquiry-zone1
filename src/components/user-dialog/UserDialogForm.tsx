
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { DialogFooter } from '@/components/ui/dialog';
import { User, UserStatus } from '@/types/rbac';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import BasicInfoSection from './BasicInfoSection';
import EmployeeDetailsSection from './EmployeeDetailsSection';
import DriverDetailsSection from './DriverDetailsSection';
import ProfileImageSection from './ProfileImageSection';
import IdentityDocumentsSection from './IdentityDocumentsSection';
import DriverLicenseSection from './DriverLicenseSection';
import MedicalInfoSection from './MedicalInfoSection';

interface UserDialogFormProps {
  user?: User | null;
  onSubmit: (userData: Partial<User>) => Promise<void>;
  isSubmitting: boolean;
  onCancel: () => void;
  config: {
    title: string;
    description: string;
    defaultRoleId: number;
    showEmployeeFields: boolean;
    showDriverFields: boolean;
    requireEmail: boolean;
  };
}

interface FormData {
  name: string;
  email: string;
  phone: string;
  status: UserStatus;
  profileImage?: string;
  badgeNumber?: string;
  dateOfBirth?: string;
  placeOfBirth?: string;
  address?: string;
  driverLicense?: string;
  // New fields
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

const UserDialogForm: React.FC<UserDialogFormProps> = ({
  user,
  onSubmit,
  isSubmitting,
  onCancel,
  config,
}) => {
  const [isEmailValid, setIsEmailValid] = useState(true);
  
  const form = useForm<FormData>({
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      status: user?.status || 'Active',
      profileImage: user?.profileImage || '',
      badgeNumber: user?.badgeNumber || '',
      dateOfBirth: user?.dateOfBirth || '',
      placeOfBirth: user?.placeOfBirth || '',
      address: user?.address || '',
      driverLicense: user?.driverLicense || '',
      // New fields with proper mapping
      identificationNational: (user as any)?.identification_national || '',
      carteNational: (user as any)?.carte_national || '',
      carteNationalStartDate: (user as any)?.carte_national_start_date || '',
      carteNationalExpiryDate: (user as any)?.carte_national_expiry_date || '',
      driverLicenseStartDate: (user as any)?.driver_license_start_date || '',
      driverLicenseExpiryDate: (user as any)?.driver_license_expiry_date || '',
      driverLicenseCategory: (user as any)?.driver_license_category || [],
      driverLicenseCategoryDates: (user as any)?.driver_license_category_dates || {},
      bloodType: (user as any)?.blood_type || '',
      companyAssignmentDate: (user as any)?.company_assignment_date || '',
    },
  });

  const watchedEmail = form.watch('email') || '';

  const handleSubmit = async (data: FormData) => {
    try {
      console.log('Submitting user form with data:', data);
      
      // Map form data to proper field names and include the default role_id
      const submitData = {
        ...data,
        role_id: config.defaultRoleId, // Use the default role from config
        identification_national: data.identificationNational,
        carte_national: data.carteNational,
        carte_national_start_date: data.carteNationalStartDate,
        carte_national_expiry_date: data.carteNationalExpiryDate,
        driver_license_start_date: data.driverLicenseStartDate,
        driver_license_expiry_date: data.driverLicenseExpiryDate,
        driver_license_category: data.driverLicenseCategory,
        driver_license_category_dates: data.driverLicenseCategoryDates,
        blood_type: data.bloodType,
        company_assignment_date: data.companyAssignmentDate,
      };
      
      await onSubmit(submitData);
      console.log('User form submitted successfully');
      form.reset();
    } catch (error) {
      console.error('Error submitting user form:', error);
    }
  };

  const canSubmit = () => {
    if (isSubmitting) return false;
    if (config.requireEmail && (!watchedEmail?.trim() || !isEmailValid)) return false;
    return true;
  };

  // Determine if we should show advanced sections based on config
  const shouldShowEmployeeSection = config.showEmployeeFields;
  const shouldShowDriverSection = config.showDriverFields;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {/* Save button moved to top */}
        <div className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-0 sm:space-x-2 pb-4 border-b">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
            className="w-full sm:w-auto"
          >
            Annuler
          </Button>
          <Button 
            type="submit" 
            disabled={!canSubmit()}
            className={`w-full sm:w-auto ${!canSubmit() ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isSubmitting ? 'Enregistrement...' : user ? 'Modifier' : 'Créer'}
          </Button>
        </div>

        <ProfileImageSection
          profileImage={form.watch('profileImage') || ''}
          userName={form.watch('name')}
          onImageChange={(url) => form.setValue('profileImage', url)}
          isSubmitting={isSubmitting}
        />

        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="basic">Base</TabsTrigger>
            <TabsTrigger value="identity">Identité</TabsTrigger>
            <TabsTrigger value="license">Permis</TabsTrigger>
            <TabsTrigger value="medical">Médical</TabsTrigger>
            {(shouldShowEmployeeSection || shouldShowDriverSection) && (
              <TabsTrigger value="details">Détails</TabsTrigger>
            )}
          </TabsList>
          
          <TabsContent value="basic" className="space-y-4 mt-6">
            <BasicInfoSection 
              control={form.control} 
              isSubmitting={isSubmitting} 
              isEmailRequired={config.requireEmail}
            />
          </TabsContent>
          
          <TabsContent value="identity" className="space-y-4 mt-6">
            <IdentityDocumentsSection 
              control={form.control} 
              isSubmitting={isSubmitting} 
            />
          </TabsContent>
          
          <TabsContent value="license" className="space-y-4 mt-6">
            <DriverLicenseSection 
              control={form.control} 
              isSubmitting={isSubmitting} 
            />
          </TabsContent>
          
          <TabsContent value="medical" className="space-y-4 mt-6">
            <MedicalInfoSection 
              control={form.control} 
              isSubmitting={isSubmitting} 
            />
          </TabsContent>
          
          {(shouldShowEmployeeSection || shouldShowDriverSection) && (
            <TabsContent value="details" className="space-y-4 mt-6">
              {shouldShowEmployeeSection && (
                <EmployeeDetailsSection 
                  control={form.control} 
                  isSubmitting={isSubmitting} 
                />
              )}
              
              {shouldShowDriverSection && (
                <DriverDetailsSection 
                  control={form.control} 
                  isSubmitting={isSubmitting} 
                />
              )}
            </TabsContent>
          )}
        </Tabs>
      </form>
    </Form>
  );
};

export default UserDialogForm;
