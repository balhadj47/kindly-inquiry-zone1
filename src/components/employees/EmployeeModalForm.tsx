
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { DialogFooter } from '@/components/ui/dialog';
import { User } from '@/types/rbac';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';
import EmployeeImageUpload from './EmployeeImageUpload';
import FormTabs from './form-sections/FormTabs';
import { FormData, getDefaultFormValues, prepareSubmitData } from './form-sections/FormDataHelpers';

interface EmployeeModalFormProps {
  employee?: User | null;
  onSubmit: (userData: Partial<User>) => Promise<void>;
  isSubmitting: boolean;
  onCancel: () => void;
}

const EmployeeModalForm: React.FC<EmployeeModalFormProps> = ({
  employee,
  onSubmit,
  isSubmitting,
  onCancel,
}) => {
  const [submitError, setSubmitError] = useState<string | null>(null);

  const form = useForm<FormData>({
    defaultValues: getDefaultFormValues(employee),
  });

  const handleSubmit = async (data: FormData) => {
    try {
      setSubmitError(null);
      console.log('🔍 EmployeeModalForm - Raw form data:', data);
      
      // Clean and prepare the data for submission - include ALL fields
      const submitData = prepareSubmitData(data);
      
      console.log('🚀 EmployeeModalForm - Final submit data:', submitData);
      console.log('🖼️ EmployeeModalForm - ProfileImage value:', JSON.stringify(submitData.profileImage));
      console.log('📅 EmployeeModalForm - Date fields:', {
        dateOfBirth: submitData.dateOfBirth,
        carteNationalStartDate: submitData.carte_national_start_date,
        carteNationalExpiryDate: submitData.carte_national_expiry_date,
        driverLicenseStartDate: submitData.driver_license_start_date,
        driverLicenseExpiryDate: submitData.driver_license_expiry_date,
        companyAssignmentDate: submitData.company_assignment_date,
      });
      
      // Log the exact data being sent to the API
      console.log('📡 EmployeeModalForm - Data being sent to API:', JSON.stringify(submitData, null, 2));
      
      await onSubmit(submitData);
      console.log('✅ EmployeeModalForm - Form submitted successfully');
      
      form.reset();
    } catch (error) {
      console.error('❌ EmployeeModalForm - Error submitting form:', error);
      
      // Log more details about the error
      if (error instanceof Error) {
        console.error('❌ Error message:', error.message);
        console.error('❌ Error stack:', error.stack);
        
        if (error.message.includes('duplicate key') || error.message.includes('unique constraint')) {
          if (error.message.includes('email')) {
            setSubmitError('Cette adresse email est déjà utilisée par un autre utilisateur. Veuillez utiliser une adresse email différente ou laisser le champ vide.');
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
    }
  };

  const handleImageChange = (url: string) => {
    console.log('🖼️ EmployeeModalForm - Image changed to:', JSON.stringify(url));
    form.setValue('profileImage', url);
    
    // Force form to re-render by triggering a change
    form.trigger('profileImage');
  };

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
        <FormTabs control={form.control} isSubmitting={isSubmitting} employee={employee} />

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
