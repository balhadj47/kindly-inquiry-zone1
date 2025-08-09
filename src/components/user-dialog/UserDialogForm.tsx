import React, { useState, useEffect, useMemo, useCallback } from 'react';
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

// Helper functions remain the same
const extractStringValue = (value: any): string => {
  if (value === null || value === undefined) return '';
  if (typeof value === 'string') return value;
  if (typeof value === 'object' && value !== null && 'value' in value) {
    return typeof value.value === 'string' ? value.value : '';
  }
  return '';
};

const extractArrayValue = (value: any): string[] => {
  if (Array.isArray(value)) return value;
  if (value === null || value === undefined) return [];
  return [];
};

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
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [hasSubmitFailed, setHasSubmitFailed] = useState(false);
  
  // Create stable default values - only recalculate when user changes
  const defaultValues = useMemo(() => {
    console.log('🔄 UserDialogForm - Creating default values for user:', user?.id || 'new user');
    
    const values = {
      name: user?.name || '',
      email: extractStringValue(user?.email),
      phone: user?.phone || '',
      status: user?.status || 'Active' as UserStatus,
      profileImage: extractStringValue(user?.profileImage),
      badgeNumber: extractStringValue(user?.badgeNumber),
      dateOfBirth: extractStringValue(user?.dateOfBirth),
      placeOfBirth: extractStringValue(user?.placeOfBirth),
      address: extractStringValue(user?.address),
      driverLicense: extractStringValue(user?.driverLicense),
      identificationNational: extractStringValue((user as any)?.identification_national),
      carteNational: extractStringValue((user as any)?.carte_national),
      carteNationalStartDate: extractStringValue((user as any)?.carte_national_start_date),
      carteNationalExpiryDate: extractStringValue((user as any)?.carte_national_expiry_date),
      driverLicenseStartDate: extractStringValue((user as any)?.driver_license_start_date),
      driverLicenseExpiryDate: extractStringValue((user as any)?.driver_license_expiry_date),
      driverLicenseCategory: extractArrayValue((user as any)?.driver_license_category),
      driverLicenseCategoryDates: extractObjectValue((user as any)?.driver_license_category_dates),
      bloodType: extractStringValue((user as any)?.blood_type),
      companyAssignmentDate: extractStringValue((user as any)?.company_assignment_date),
    };
    
    console.log('✅ UserDialogForm - Default values created:', Object.keys(values));
    return values;
  }, [user?.id, user?.name, user?.email, user?.phone]); // Minimal dependencies
  
  const form = useForm<FormData>({
    defaultValues,
    mode: 'onChange',
  });

  // Reset form only when user changes or on initial load
  useEffect(() => {
    if (!hasSubmitFailed) { // Don't reset if there was a submit failure
      console.log('🔄 UserDialogForm - Resetting form for user:', user?.id || 'new user');
      form.reset(defaultValues);
    }
  }, [user?.id, form, defaultValues, hasSubmitFailed]);

  // Clear error when form data changes
  useEffect(() => {
    if (submitError && !hasSubmitFailed) {
      setSubmitError(null);
    }
  }, [form.watch(), submitError, hasSubmitFailed]);

  const handleSubmit = useCallback(async (data: FormData) => {
    console.log('🔍 UserDialogForm - Starting form submission with data:', Object.keys(data));
    
    try {
      setSubmitError(null);
      setHasSubmitFailed(false);
      
      // Process profile image safely
      const profileImageValue = data.profileImage?.trim() || null;
      
      console.log('🖼️ UserDialogForm - Processing profileImage:', { 
        original: data.profileImage, 
        final: profileImageValue 
      });
      
      // Create clean data for submission
      const submitData = {
        name: data.name,
        email: data.email || null,
        phone: data.phone || null,
        status: data.status,
        profileImage: profileImageValue,
        badgeNumber: data.badgeNumber || null,
        dateOfBirth: data.dateOfBirth || null,
        placeOfBirth: data.placeOfBirth || null,
        address: data.address || null,
        driverLicense: data.driverLicense || null,
        role_id: config.defaultRoleId,
        identification_national: data.identificationNational || null,
        carte_national: data.carteNational || null,
        carte_national_start_date: data.carteNationalStartDate || null,
        carte_national_expiry_date: data.carteNationalExpiryDate || null,
        driver_license_start_date: data.driverLicenseStartDate || null,
        driver_license_expiry_date: data.driverLicenseExpiryDate || null,
        driver_license_category: data.driverLicenseCategory?.length ? [...data.driverLicenseCategory] : null,
        driver_license_category_dates: data.driverLicenseCategoryDates && Object.keys(data.driverLicenseCategoryDates).length 
          ? JSON.parse(JSON.stringify(data.driverLicenseCategoryDates)) 
          : null,
        blood_type: data.bloodType || null,
        company_assignment_date: data.companyAssignmentDate || null,
      };
      
      console.log('🚀 UserDialogForm - Submitting data to parent:', Object.keys(submitData));
      
      await onSubmit(submitData);
      
      console.log('✅ UserDialogForm - Submission successful');
      
      // Only reset form after successful submission
      setHasSubmitFailed(false);
      
    } catch (error) {
      console.error('❌ UserDialogForm - Submission failed:', error);
      
      setHasSubmitFailed(true);
      
      // Handle specific errors
      if (error instanceof Error) {
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
        setSubmitError('Une erreur inattendue s\'est produite. Veuillez réessayer.');
      }
      
      // Do NOT reset form on error - keep user data
      console.log('❌ UserDialogForm - Keeping form data after error');
    }
  }, [onSubmit, config.defaultRoleId]);

  const watchedEmail = form.watch('email') || '';

  const canSubmit = () => {
    if (isSubmitting) return false;
    if (config.requireEmail && (!watchedEmail?.trim())) return false;
    return true;
  };

  const handleCancel = () => {
    setSubmitError(null);
    setHasSubmitFailed(false);
    onCancel();
  };

  // Determine which sections to show
  const shouldShowEmployeeSection = config.showEmployeeFields;
  const shouldShowDriverSection = config.showDriverFields;

  // Render content based on active tab
  const renderTabContent = () => {
    switch (activeTab) {
      case 'personal':
        return (
          <div className="space-y-6">
            {submitError && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>{submitError}</AlertDescription>
              </Alert>
            )}

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
            {submitError && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>{submitError}</AlertDescription>
              </Alert>
            )}

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
            {submitError && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>{submitError}</AlertDescription>
              </Alert>
            )}

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

        <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-0 sm:space-x-2 pt-6 mt-6 border-t border-border/50">
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
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
