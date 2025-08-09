
import React, { useEffect } from 'react';
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
  submitError?: string | null;
}

const EmployeeModalForm: React.FC<EmployeeModalFormProps> = ({
  employee,
  onSubmit,
  isSubmitting,
  onCancel,
  submitError,
}) => {
  const form = useForm<FormData>({
    defaultValues: getDefaultFormValues(employee),
  });

  // Reset form only when employee changes (not on errors)
  useEffect(() => {
    const currentEmployeeId = employee?.id;
    const formEmployeeId = form.getValues().name; // Use name as identifier since FormData doesn't have id
    
    if (currentEmployeeId !== formEmployeeId) {
      console.log('🔄 EmployeeModalForm - Resetting form for new employee');
      form.reset(getDefaultFormValues(employee));
    }
  }, [employee?.id, form]);

  const handleSubmit = async (data: FormData) => {
    try {
      console.log('🔍 EmployeeModalForm - Raw form data:', data);
      
      // Clean and prepare the data for submission
      const submitData = prepareSubmitData(data);
      
      console.log('🚀 EmployeeModalForm - Final submit data:', submitData);
      
      await onSubmit(submitData);
      console.log('✅ EmployeeModalForm - Form submitted successfully');
      
      // Only reset form on successful submission
      form.reset();
      
    } catch (error) {
      console.error('❌ EmployeeModalForm - Error submitting form:', error);
      // Don't reset form on error - let the error be displayed and form data preserved
    }
  };

  const handleImageChange = (url: string) => {
    console.log('🖼️ EmployeeModalForm - Image changed to:', JSON.stringify(url));
    form.setValue('profileImage', url);
    form.trigger('profileImage');
  };

  const handleCancel = () => {
    // Reset form when canceling
    form.reset();
    onCancel();
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

        {/* Tabbed Interface - now includes employee prop for notes tab */}
        <FormTabs control={form.control} isSubmitting={isSubmitting} employee={employee} />

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
