
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
import { User as UserIcon, IdCard, Car, Heart, Briefcase } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

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
      
      // Extract the profile image value if it's wrapped in an object
      let profileImageValue = data.profileImage;
      if (typeof profileImageValue === 'object' && profileImageValue !== null && 'value' in profileImageValue) {
        profileImageValue = (profileImageValue as any).value;
      }
      
      // Map form data to proper field names and include the default role_id
      const submitData = {
        ...data,
        profileImage: profileImageValue, // Use the extracted value
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
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        {/* Compact profile section */}
        <div className="bg-muted/30 rounded-lg p-4 border border-border/50">
          <ProfileImageSection
            profileImage={form.watch('profileImage') || ''}
            userName={form.watch('name')}
            onImageChange={(url) => form.setValue('profileImage', url)}
            isSubmitting={isSubmitting}
          />
        </div>

        {/* Compact tabs with smaller colored icons */}
        <TooltipProvider>
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full h-10 p-1 bg-muted/50 border border-border/50" style={{
              gridTemplateColumns: (shouldShowEmployeeSection || shouldShowDriverSection) 
                ? 'repeat(5, 1fr)' 
                : 'repeat(4, 1fr)'
            }}>
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
                    value="license"
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
              
              {(shouldShowEmployeeSection || shouldShowDriverSection) && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <TabsTrigger 
                      value="details"
                      className="flex items-center justify-center py-2 px-2 data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all duration-200"
                    >
                      <Briefcase className="h-3.5 w-3.5 text-orange-600" />
                    </TabsTrigger>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Détails professionnels</p>
                  </TooltipContent>
                </Tooltip>
              )}
            </TabsList>
            
            <TabsContent value="basic" className="mt-4 bg-card/50 rounded-lg p-3 sm:p-4 border border-border/50 space-y-4">
              <BasicInfoSection 
                control={form.control} 
                isSubmitting={isSubmitting} 
                isEmailRequired={config.requireEmail}
              />
            </TabsContent>
            
            <TabsContent value="identity" className="mt-4 bg-card/50 rounded-lg p-3 sm:p-4 border border-border/50 space-y-4">
              <IdentityDocumentsSection 
                control={form.control} 
                isSubmitting={isSubmitting} 
              />
            </TabsContent>
            
            <TabsContent value="license" className="mt-4 bg-card/50 rounded-lg p-3 sm:p-4 border border-border/50 space-y-4">
              <DriverLicenseSection 
                control={form.control} 
                isSubmitting={isSubmitting} 
              />
            </TabsContent>
            
            <TabsContent value="medical" className="mt-4 bg-card/50 rounded-lg p-3 sm:p-4 border border-border/50 space-y-4">
              <MedicalInfoSection 
                control={form.control} 
                isSubmitting={isSubmitting} 
              />
            </TabsContent>
            
            {(shouldShowEmployeeSection || shouldShowDriverSection) && (
              <TabsContent value="details" className="mt-4 bg-card/50 rounded-lg p-3 sm:p-4 border border-border/50 space-y-4">
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
        </TooltipProvider>

        {/* Save/Cancel buttons at bottom */}
        <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-0 sm:space-x-2 pt-6 mt-6 border-t border-border/50">
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
            className={`w-full sm:w-auto transition-all duration-200 ${
              !canSubmit() 
                ? 'opacity-50 cursor-not-allowed' 
                : 'hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] bg-primary hover:bg-primary/90'
            }`}
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Enregistrement...
              </div>
            ) : (
              user ? 'Modifier' : 'Créer'
            )}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

export default UserDialogForm;
