
import React from 'react';
import { useForm } from 'react-hook-form';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { DialogFooter } from '@/components/ui/dialog';
import { User, UserStatus } from '@/types/rbac';
import { SystemGroupName } from '@/types/systemGroups';
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
  email: string;
  phone: string;
  systemGroup: SystemGroupName;
  status: UserStatus;
  profileImage?: string;
}

const UserModalForm: React.FC<UserModalFormProps> = ({
  user,
  onSubmit,
  isSubmitting,
  onCancel,
}) => {
  const form = useForm<FormData>({
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      systemGroup: user?.systemGroup || 'Employee',
      status: user?.status || 'Active',
      profileImage: user?.profileImage || '',
    },
  });

  const watchedRole = form.watch('systemGroup');

  const handleSubmit = async (data: FormData) => {
    try {
      await onSubmit(data);
      form.reset();
    } catch (error) {
      console.error('Error submitting user form:', error);
    }
  };

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
          watchedRole={watchedRole}
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
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Enregistrement...' : user ? 'Modifier' : 'Créer'}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

export default UserModalForm;
