
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { DialogFooter } from '@/components/ui/dialog';
import { User, UserStatus } from '@/types/rbac';
import UserFormFields from './UserFormFields';
import ProfileImageUpload from './ProfileImageUpload';

interface UserModalFormProps {
  user?: User | null;
  onSubmit: (userData: Partial<User>) => Promise<void>;
  isSubmitting: boolean;
  onCancel: () => void;
}

interface FormData {
  name: string;
  email: string; // Required for creating auth accounts
  phone?: string; // Optional
  role_id: number;
  status: UserStatus;
  profileImage?: string;
  badgeNumber?: string;
  dateOfBirth?: string;
  placeOfBirth?: string;
  address?: string;
  driverLicense?: string;
}

const UserModalForm: React.FC<UserModalFormProps> = ({
  user,
  onSubmit,
  isSubmitting,
  onCancel,
}) => {
  const [isEmailValid, setIsEmailValid] = useState(true);
  
  const form = useForm<FormData>({
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      role_id: user?.role_id || 2, // Default to Supervisor (2)
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

  const canSubmit = isEmailValid && !isSubmitting && form.watch('email')?.trim();

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <ProfileImageUpload
          profileImage={form.watch('profileImage') || ''}
          userName={form.watch('name')}
          onImageChange={(url) => form.setValue('profileImage', url)}
          isSubmitting={isSubmitting}
        />

        <UserFormFields
          control={form.control}
          isSubmitting={isSubmitting}
          watchedRoleId={watchedRoleId}
          watchedEmail={watchedEmail}
          onEmailValidationChange={setIsEmailValid}
          userId={user?.id}
          isEmailRequired={!user} // Email is required for new users
        />

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Annuler
          </Button>
          <Button 
            type="submit" 
            disabled={!canSubmit}
            className={!canSubmit ? 'opacity-50 cursor-not-allowed' : ''}
          >
            {isSubmitting ? 'Enregistrement...' : user ? 'Modifier' : 'Créer'}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

export default UserModalForm;
