
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { DialogFooter } from '@/components/ui/dialog';
import { User, UserStatus } from '@/types/rbac';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import BasicInfoSection from './BasicInfoSection';
import RoleSection from './RoleSection';
import EmployeeDetailsSection from './EmployeeDetailsSection';
import DriverDetailsSection from './DriverDetailsSection';
import ProfileImageSection from './ProfileImageSection';

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
  role_id: number;
  status: UserStatus;
  profileImage?: string;
  badgeNumber?: string;
  dateOfBirth?: string;
  placeOfBirth?: string;
  address?: string;
  driverLicense?: string;
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
      role_id: user?.role_id || config.defaultRoleId,
      status: user?.status || 'Active',
      profileImage: user?.profileImage || '',
      badgeNumber: user?.badgeNumber || '',
      dateOfBirth: user?.dateOfBirth || '',
      placeOfBirth: user?.placeOfBirth || '',
      address: user?.address || '',
      driverLicense: user?.driverLicense || '',
    },
  });

  const watchedRoleId = form.watch('role_id');
  const watchedEmail = form.watch('email') || '';

  const handleSubmit = async (data: FormData) => {
    try {
      console.log('Submitting user form with data:', data);
      await onSubmit(data);
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

  // Determine if we should show advanced sections based on config or role
  const shouldShowEmployeeSection = config.showEmployeeFields || watchedRoleId === 3;
  const shouldShowDriverSection = config.showDriverFields || watchedRoleId === 4;
  const shouldShowTabs = shouldShowEmployeeSection || shouldShowDriverSection;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <ProfileImageSection
          profileImage={form.watch('profileImage') || ''}
          userName={form.watch('name')}
          onImageChange={(url) => form.setValue('profileImage', url)}
          isSubmitting={isSubmitting}
        />

        {shouldShowTabs ? (
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="basic">Informations de base</TabsTrigger>
              {shouldShowEmployeeSection && <TabsTrigger value="employee">Employé</TabsTrigger>}
              {shouldShowDriverSection && <TabsTrigger value="driver">Chauffeur</TabsTrigger>}
            </TabsList>
            
            <TabsContent value="basic" className="space-y-4 mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <BasicInfoSection 
                  control={form.control} 
                  isSubmitting={isSubmitting} 
                  isEmailRequired={config.requireEmail}
                />
                <RoleSection 
                  control={form.control} 
                  isSubmitting={isSubmitting} 
                  watchedRoleId={watchedRoleId}
                  watchedEmail={watchedEmail}
                  onEmailValidationChange={setIsEmailValid}
                  userId={user?.id}
                />
              </div>
            </TabsContent>
            
            {shouldShowEmployeeSection && (
              <TabsContent value="employee" className="space-y-4 mt-6">
                <EmployeeDetailsSection 
                  control={form.control} 
                  isSubmitting={isSubmitting} 
                />
              </TabsContent>
            )}
            
            {shouldShowDriverSection && (
              <TabsContent value="driver" className="space-y-4 mt-6">
                <DriverDetailsSection 
                  control={form.control} 
                  isSubmitting={isSubmitting} 
                />
              </TabsContent>
            )}
          </Tabs>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <BasicInfoSection 
              control={form.control} 
              isSubmitting={isSubmitting} 
              isEmailRequired={config.requireEmail}
            />
            <RoleSection 
              control={form.control} 
              isSubmitting={isSubmitting} 
              watchedRoleId={watchedRoleId}
              watchedEmail={watchedEmail}
              onEmailValidationChange={setIsEmailValid}
              userId={user?.id}
            />
          </div>
        )}

        <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-0 sm:space-x-2 pt-4">
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
        </DialogFooter>
      </form>
    </Form>
  );
};

export default UserDialogForm;
