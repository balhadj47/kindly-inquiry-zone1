
import React, { useState, useEffect, useMemo } from 'react';
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
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';
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
  activeTab?: string;
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

// Helper function to safely extract string values
const extractStringValue = (value: any): string | undefined => {
  if (value === null || value === undefined) return undefined;
  if (typeof value === 'string') return value;
  if (typeof value === 'object' && value !== null && 'value' in value) {
    return typeof value.value === 'string' ? value.value : undefined;
  }
  return undefined;
};

// Helper function to safely extract array values
const extractArrayValue = (value: any): string[] => {
  if (Array.isArray(value)) return value;
  if (value === null || value === undefined) return [];
  return [];
};

// Helper function to safely extract object values
const extractObjectValue = (value: any): Record<string, any> => {
  if (typeof value === 'object' && value !== null && !Array.isArray(value)) return value;
  return {};
};

const UserDialogForm: React.FC<UserDialogFormProps> = ({
  user,
  onSubmit,
  isSubmitting,
  onCancel,
  config,
  activeTab = 'personal',
}) => {
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [submitError, setSubmitError] = useState<string | null>(null);
  
  // Memoize default values to prevent re-initialization
  const defaultValues = useMemo(() => ({
    name: user?.name || '',
    email: extractStringValue(user?.email) || '',
    phone: user?.phone || '',
    status: user?.status || 'Active' as UserStatus,
    profileImage: extractStringValue(user?.profileImage) || '',
    badgeNumber: extractStringValue(user?.badgeNumber) || '',
    dateOfBirth: extractStringValue(user?.dateOfBirth) || '',
    placeOfBirth: extractStringValue(user?.placeOfBirth) || '',
    address: extractStringValue(user?.address) || '',
    driverLicense: extractStringValue(user?.driverLicense) || '',
    // New fields with proper mapping and safe extraction
    identificationNational: extractStringValue((user as any)?.identification_national) || '',
    carteNational: extractStringValue((user as any)?.carte_national) || '',
    carteNationalStartDate: extractStringValue((user as any)?.carte_national_start_date) || '',
    carteNationalExpiryDate: extractStringValue((user as any)?.carte_national_expiry_date) || '',
    driverLicenseStartDate: extractStringValue((user as any)?.driver_license_start_date) || '',
    driverLicenseExpiryDate: extractStringValue((user as any)?.driver_license_expiry_date) || '',
    driverLicenseCategory: extractArrayValue((user as any)?.driver_license_category),
    driverLicenseCategoryDates: extractObjectValue((user as any)?.driver_license_category_dates),
    bloodType: extractStringValue((user as any)?.blood_type) || '',
    companyAssignmentDate: extractStringValue((user as any)?.company_assignment_date) || '',
  }), [user]);
  
  const form = useForm<FormData>({
    defaultValues,
    mode: 'onChange', // Enable real-time validation
  });

  // Reset form only when user changes (not on tab changes)
  useEffect(() => {
    console.log('🔄 UserDialogForm - User changed, resetting form with:', defaultValues);
    form.reset(defaultValues);
  }, [user?.id, form, defaultValues]);

  const watchedEmail = form.watch('email') || '';

  const handleSubmit = async (data: FormData) => {
    try {
      console.log('🔍 UserDialogForm - Submitting user form with data:', data);
      setSubmitError(null);
      
      // Safely handle profile image - ensure it's a string or undefined
      const profileImageValue = data.profileImage;
      let finalProfileImageValue: string | undefined = undefined;
      
      if (profileImageValue && typeof profileImageValue === 'string' && profileImageValue.trim() !== '') {
        finalProfileImageValue = profileImageValue.trim();
      }
      
      console.log('🖼️ UserDialogForm - Processing profileImage:', { 
        original: profileImageValue, 
        final: finalProfileImageValue 
      });
      
      // Create a clean copy of driver license categories to avoid circular references
      const cleanDriverLicenseCategory = Array.isArray(data.driverLicenseCategory) 
        ? [...data.driverLicenseCategory] 
        : [];
      
      const cleanDriverLicenseCategoryDates = data.driverLicenseCategoryDates && typeof data.driverLicenseCategoryDates === 'object'
        ? JSON.parse(JSON.stringify(data.driverLicenseCategoryDates))
        : {};
      
      // Map form data to proper field names and include the default role_id
      const submitData = {
        name: data.name,
        email: data.email || null,
        phone: data.phone || null,
        status: data.status,
        profileImage: finalProfileImageValue,
        badgeNumber: data.badgeNumber || null,
        dateOfBirth: data.dateOfBirth || null,
        placeOfBirth: data.placeOfBirth || null,
        address: data.address || null,
        driverLicense: data.driverLicense || null,
        role_id: config.defaultRoleId,
        // Map to database field names
        identification_national: data.identificationNational || null,
        carte_national: data.carteNational || null,
        carte_national_start_date: data.carteNationalStartDate || null,
        carte_national_expiry_date: data.carteNationalExpiryDate || null,
        driver_license_start_date: data.driverLicenseStartDate || null,
        driver_license_expiry_date: data.driverLicenseExpiryDate || null,
        driver_license_category: cleanDriverLicenseCategory.length > 0 ? cleanDriverLicenseCategory : null,
        driver_license_category_dates: Object.keys(cleanDriverLicenseCategoryDates).length > 0 ? cleanDriverLicenseCategoryDates : null,
        blood_type: data.bloodType || null,
        company_assignment_date: data.companyAssignmentDate || null,
      };
      
      console.log('🚀 UserDialogForm - Final submit data:', submitData);
      
      await onSubmit(submitData);
      console.log('✅ UserDialogForm - User form submitted successfully');
      
      // Only reset form on successful submission
      form.reset(defaultValues);
    } catch (error) {
      console.error('❌ UserDialogForm - Error submitting user form:', error);
      
      // Handle specific errors and show them to the user
      if (error instanceof Error) {
        console.error('❌ Error message:', error.message);
        console.error('❌ Error stack:', error.stack);
        
        if (error.message.includes('duplicate key') || error.message.includes('unique constraint')) {
          if (error.message.includes('email')) {
            setSubmitError('Cette adresse email est déjà utilisée par un autre utilisateur. Veuillez utiliser une adresse email différente.');
          } else {
            setSubmitError('Cette valeur est déjà utilisée. Veuillez en choisir une autre.');
          }
        } else if (error.message.includes('permission')) {
          setSubmitError('Vous n\'avez pas les permissions nécessaires pour effectuer cette action.');
        } else if (error.message.includes('violates row-level security')) {
          setSubmitError('Erreur de sécurité lors de l\'enregistrement. Vérifiez vos permissions.');
        } else if (error.message.includes('invalid input syntax')) {
          setSubmitError('Format de données invalide. Vérifiez les dates et autres champs.');
        } else {
          setSubmitError(`Erreur: ${error.message}`);
        }
      } else {
        console.error('❌ Unknown error type:', typeof error, error);
        setSubmitError('Une erreur inattendue s\'est produite. Veuillez réessayer.');
      }
      
      // Re-throw the error so the parent component knows it failed
      throw error;
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

  // Render content based on active tab
  const renderTabContent = () => {
    switch (activeTab) {
      case 'personal':
        return (
          <div className="space-y-6">
            {/* Error Alert */}
            {submitError && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>{submitError}</AlertDescription>
              </Alert>
            )}

            {/* Profile Photo Section */}
            <div className="bg-muted/30 rounded-lg p-4 border border-border/50">
              <ProfileImageSection
                profileImage={form.watch('profileImage') || ''}
                userName={form.watch('name')}
                onImageChange={(url) => {
                  console.log('🖼️ UserDialogForm - Profile image changed:', url);
                  form.setValue('profileImage', url);
                }}
                isSubmitting={isSubmitting}
              />
            </div>
            
            {/* Basic Information */}
            <div className="bg-card/50 rounded-lg p-4 border border-border/50 space-y-4">
              <BasicInfoSection 
                control={form.control} 
                isSubmitting={isSubmitting} 
                isEmailRequired={config.requireEmail}
              />
            </div>
          </div>
        );
        
      case 'documents':
        return (
          <div className="space-y-6">
            {/* Error Alert */}
            {submitError && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>{submitError}</AlertDescription>
              </Alert>
            )}

            {/* Identity Documents */}
            <div className="bg-card/50 rounded-lg p-4 border border-border/50 space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <IdCard className="h-5 w-5 text-purple-600" />
                <h3 className="text-lg font-semibold">Documents d'identité</h3>
              </div>
              <IdentityDocumentsSection 
                control={form.control} 
                isSubmitting={isSubmitting} 
              />
            </div>
            
            {/* Driver License */}
            <div className="bg-card/50 rounded-lg p-4 border border-border/50 space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Car className="h-5 w-5 text-green-600" />
                <h3 className="text-lg font-semibold">Permis de conduire</h3>
              </div>
              <DriverLicenseSection 
                control={form.control} 
                isSubmitting={isSubmitting} 
              />
            </div>
          </div>
        );
        
      case 'professional':
        return (
          <div className="space-y-6">
            {/* Error Alert */}
            {submitError && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>{submitError}</AlertDescription>
              </Alert>
            )}

            {/* Employee Details */}
            {shouldShowEmployeeSection && (
              <div className="bg-card/50 rounded-lg p-4 border border-border/50 space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <Briefcase className="h-5 w-5 text-green-600" />
                  <h3 className="text-lg font-semibold">Informations employé</h3>
                </div>
                <EmployeeDetailsSection 
                  control={form.control} 
                  isSubmitting={isSubmitting} 
                />
              </div>
            )}
            
            {/* Driver Details */}
            {shouldShowDriverSection && (
              <div className="bg-card/50 rounded-lg p-4 border border-border/50 space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <Car className="h-5 w-5 text-blue-600" />
                  <h3 className="text-lg font-semibold">Informations chauffeur</h3>
                </div>
                <DriverDetailsSection 
                  control={form.control} 
                  isSubmitting={isSubmitting} 
                />
              </div>
            )}
            
            {/* Medical Information */}
            <div className="bg-card/50 rounded-lg p-4 border border-border/50 space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Heart className="h-5 w-5 text-red-500" />
                <h3 className="text-lg font-semibold">Informations médicales</h3>
              </div>
              <MedicalInfoSection 
                control={form.control} 
                isSubmitting={isSubmitting} 
              />
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        {renderTabContent()}

        {/* Save/Cancel buttons at bottom */}
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
