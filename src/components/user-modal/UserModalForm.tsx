
import React, { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { useRBAC } from '@/contexts/RBACContext';
import { User, UserRole, UserStatus } from '@/types/rbac';
import { getGroupIdForRole, isDriverRole } from '@/utils/userModalUtils';
import ProfileImageUpload from './ProfileImageUpload';
import UserFormFields from './UserFormFields';
import DriverFields from './DriverFields';

interface UserFormData {
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  status: UserStatus;
  licenseNumber: string;
  totalTrips: number;
  lastTrip: string;
  profileImage?: string;
}

interface UserModalFormProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
}

const UserModalForm: React.FC<UserModalFormProps> = ({ user, isOpen, onClose }) => {
  const { addUser, updateUser } = useRBAC();
  const [profileImage, setProfileImage] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<UserFormData>({
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      role: 'Employee',
      status: 'Active',
      licenseNumber: '',
      totalTrips: 0,
      lastTrip: '',
      profileImage: '',
    }
  });

  // Reset form when modal opens with different user data
  useEffect(() => {
    if (isOpen) {
      console.log('Modal opened, resetting form for user:', user?.id || 'new user');
      
      if (user) {
        const formData = {
          name: user.name || '',
          email: user.email || '',
          phone: user.phone || '',
          role: user.role || 'Employee',
          status: user.status || 'Active',
          licenseNumber: user.licenseNumber || '',
          totalTrips: user.totalTrips || 0,
          lastTrip: user.lastTrip || '',
          profileImage: user.profileImage || '',
        };
        console.log('Setting form data:', formData);
        form.reset(formData);
        setProfileImage(user.profileImage || '');
      } else {
        form.reset({
          name: '',
          email: '',
          phone: '',
          role: 'Employee',
          status: 'Active',
          licenseNumber: '',
          totalTrips: 0,
          lastTrip: '',
          profileImage: '',
        });
        setProfileImage('');
      }
    } else {
      // Reset submission state when modal closes
      console.log('Modal closed, resetting submission state');
      setIsSubmitting(false);
    }
  }, [isOpen, user?.id, form]);

  const handleImageChange = (image: string) => {
    setProfileImage(image);
    form.setValue('profileImage', image);
  };

  const handleSubmit = async (data: UserFormData) => {
    if (isSubmitting) {
      console.log('Already submitting, ignoring duplicate submission');
      return;
    }
    
    console.log('Starting form submission:', { isUpdate: !!user, data });
    setIsSubmitting(true);
    
    try {
      const userData = {
        ...data,
        groupId: getGroupIdForRole(data.role),
        createdAt: user?.createdAt || new Date().toISOString(),
        licenseNumber: data.licenseNumber || undefined,
        totalTrips: data.totalTrips || 0,
        lastTrip: data.lastTrip || undefined,
        profileImage: profileImage || undefined,
      };

      console.log('Submitting user data:', userData);

      if (user) {
        console.log('Updating existing user:', user.id);
        await updateUser(user.id, userData);
      } else {
        console.log('Creating new user');
        await addUser(userData);
      }
      
      console.log('User operation completed successfully');
      
      // Close modal after successful operation
      onClose();
    } catch (error) {
      console.error('Error saving user:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      console.log('Closing modal');
      onClose();
    } else {
      console.log('Cannot close modal while submitting');
    }
  };

  const watchedRole = form.watch('role');
  const watchedName = form.watch('name');

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <ProfileImageUpload
          profileImage={profileImage}
          userName={watchedName}
          onImageChange={handleImageChange}
          isSubmitting={isSubmitting}
        />

        <UserFormFields
          control={form.control}
          isSubmitting={isSubmitting}
          watchedRole={watchedRole}
        />

        {isDriverRole(watchedRole) && (
          <DriverFields
            control={form.control}
            isSubmitting={isSubmitting}
          />
        )}

        <div className="flex justify-end space-x-2 pt-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={handleClose} 
            disabled={isSubmitting}
          >
            Annuler
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Sauvegarde...' : (user ? 'Mettre à Jour l\'Utilisateur' : 'Créer l\'Utilisateur')}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default UserModalForm;
