
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { DialogFooter } from '@/components/ui/dialog';
import { User, UserStatus } from '@/types/rbac';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import BasicInfoSection from './BasicInfoSection';
import EmployeeDetailsSection from './EmployeeDetailsSection';
import DriverDetailsSection from './DriverDetailsSection';
import ProfileImageSection from './ProfileImageSection';
import IdentityDocumentsSection from './IdentityDocumentsSection';
import DriverLicenseSection from './DriverLicenseSection';
import MedicalInfoSection from './MedicalInfoSection';
import { User as UserIcon, IdCard, Car, Heart, Briefcase } from 'lucide-react';

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

  // Helper function to count filled fields in each section
  const getFieldCompletionStatus = (section: string) => {
    const formValues = form.getValues();
    let filledCount = 0;
    let totalCount = 0;

    switch (section) {
      case 'basic':
        const basicFields = ['name', 'email', 'phone', 'status'];
        totalCount = config.requireEmail ? 4 : 3;
        filledCount = basicFields.filter(field => 
          field === 'email' ? (config.requireEmail ? formValues[field]?.trim() : true) : formValues[field]?.toString().trim()
        ).length;
        break;
      case 'identity':
        const identityFields = ['identificationNational', 'carteNational', 'carteNationalStartDate', 'carteNationalExpiryDate'];
        totalCount = identityFields.length;
        filledCount = identityFields.filter(field => formValues[field]?.toString().trim()).length;
        break;
      case 'license':
        const licenseFields = ['driverLicense', 'driverLicenseStartDate', 'driverLicenseExpiryDate'];
        totalCount = licenseFields.length;
        filledCount = licenseFields.filter(field => 
          field === 'driverLicenseCategory' ? formValues[field]?.length > 0 : formValues[field]?.toString().trim()
        ).length;
        if (formValues.driverLicenseCategory?.length > 0) filledCount++;
        totalCount++;
        break;
      case 'medical':
        const medicalFields = ['bloodType', 'companyAssignmentDate'];
        totalCount = medicalFields.length;
        filledCount = medicalFields.filter(field => formValues[field]?.toString().trim()).length;
        break;
      case 'details':
        const detailFields = ['badgeNumber', 'dateOfBirth', 'placeOfBirth', 'address'];
        totalCount = detailFields.length;
        filledCount = detailFields.filter(field => formValues[field]?.toString().trim()).length;
        break;
      default:
        return { filledCount: 0, totalCount: 0, percentage: 0 };
    }

    const percentage = totalCount > 0 ? Math.round((filledCount / totalCount) * 100) : 0;
    return { filledCount, totalCount, percentage };
  };

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
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        {/* Compact save button section */}
        <div className="flex flex-col-reverse sm:flex-row gap-2 pb-3 border-b border-border/50">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
            className="w-full sm:w-auto text-sm"
          >
            Annuler
          </Button>
          <Button 
            type="submit" 
            disabled={!canSubmit()}
            className={`w-full sm:w-auto text-sm transition-all duration-200 ${
              !canSubmit() 
                ? 'opacity-50 cursor-not-allowed' 
                : 'hover:shadow-md hover:scale-[1.02] active:scale-[0.98]'
            }`}
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Enregistrement...
              </div>
            ) : (
              user ? 'Modifier' : 'Créer'
            )}
          </Button>
        </div>

        {/* Compact profile section */}
        <div className="bg-muted/30 rounded-lg p-4 border border-border/50">
          <ProfileImageSection
            profileImage={form.watch('profileImage') || ''}
            userName={form.watch('name')}
            onImageChange={(url) => form.setValue('profileImage', url)}
            isSubmitting={isSubmitting}
          />
        </div>

        {/* Mobile-optimized tabs */}
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full h-auto p-1 bg-muted/50 border border-border/50 overflow-x-auto" style={{
            gridTemplateColumns: (shouldShowEmployeeSection || shouldShowDriverSection) 
              ? 'repeat(5, minmax(100px, 1fr))' 
              : 'repeat(4, minmax(100px, 1fr))'
          }}>
            <TabsTrigger 
              value="basic" 
              className="flex flex-col items-center gap-1 py-2 px-1 text-xs data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all duration-200 min-w-0"
            >
              <UserIcon className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="font-medium truncate">Base</span>
              <Badge 
                variant={getFieldCompletionStatus('basic').percentage === 100 ? 'default' : 'secondary'} 
                className="text-[9px] px-1 py-0 h-auto"
              >
                {getFieldCompletionStatus('basic').percentage}%
              </Badge>
            </TabsTrigger>
            
            <TabsTrigger 
              value="identity"
              className="flex flex-col items-center gap-1 py-2 px-1 text-xs data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all duration-200 min-w-0"
            >
              <IdCard className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="font-medium truncate">Identité</span>
              <Badge 
                variant={getFieldCompletionStatus('identity').percentage === 100 ? 'default' : 'secondary'} 
                className="text-[9px] px-1 py-0 h-auto"
              >
                {getFieldCompletionStatus('identity').percentage}%
              </Badge>
            </TabsTrigger>
            
            <TabsTrigger 
              value="license"
              className="flex flex-col items-center gap-1 py-2 px-1 text-xs data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all duration-200 min-w-0"
            >
              <Car className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="font-medium truncate">Permis</span>
              <Badge 
                variant={getFieldCompletionStatus('license').percentage === 100 ? 'default' : 'secondary'} 
                className="text-[9px] px-1 py-0 h-auto"
              >
                {getFieldCompletionStatus('license').percentage}%
              </Badge>
            </TabsTrigger>
            
            <TabsTrigger 
              value="medical"
              className="flex flex-col items-center gap-1 py-2 px-1 text-xs data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all duration-200 min-w-0"
            >
              <Heart className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="font-medium truncate">Médical</span>
              <Badge 
                variant={getFieldCompletionStatus('medical').percentage === 100 ? 'default' : 'secondary'} 
                className="text-[9px] px-1 py-0 h-auto"
              >
                {getFieldCompletionStatus('medical').percentage}%
              </Badge>
            </TabsTrigger>
            
            {(shouldShowEmployeeSection || shouldShowDriverSection) && (
              <TabsTrigger 
                value="details"
                className="flex flex-col items-center gap-1 py-2 px-1 text-xs data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all duration-200 min-w-0"
              >
                <Briefcase className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="font-medium truncate">Détails</span>
                <Badge 
                  variant={getFieldCompletionStatus('details').percentage === 100 ? 'default' : 'secondary'} 
                  className="text-[9px] px-1 py-0 h-auto"
                >
                  {getFieldCompletionStatus('details').percentage}%
                </Badge>
              </TabsTrigger>
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
      </form>
    </Form>
  );
};

export default UserDialogForm;
