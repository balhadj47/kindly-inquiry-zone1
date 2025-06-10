
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
  const submissionInProgress = useRef(false);
  
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

  // Reset form and state when modal opens with a new user or closes
  useEffect(() => {
    console.log('Modal state changed:', { isOpen, userId: user?.id, submissionInProgress: submissionInProgress.current });
    
    if (isOpen && !submissionInProgress.current) {
      if (user) {
        console.log('Resetting form for existing user:', user.id);
        form.reset({
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          status: user.status,
          licenseNumber: user.licenseNumber || '',
          totalTrips: user.totalTrips || 0,
          lastTrip: user.lastTrip || '',
          profileImage: user.profileImage || '',
        });
        setProfileImage(user.profileImage || '');
      } else {
        console.log('Resetting form for new user');
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
    }
    
    // Clean up submission state when modal closes
    if (!isOpen && !submissionInProgress.current) {
      console.log('Modal closed, cleaning up state');
      setIsSubmitting(false);
    }
  }, [user?.id, form, isOpen]);

  const handleImageChange = (image: string) => {
    setProfileImage(image);
    form.setValue('profileImage', image);
  };

  const handleSubmit = async (data: UserFormData) => {
    if (isSubmitting || submissionInProgress.current) {
      console.log('Submission already in progress, ignoring');
      return;
    }
    
    console.log('Starting submission for user:', user ? 'update' : 'create');
    setIsSubmitting(true);
    submissionInProgress.current = true;
    
    try {
      const userData = {
        ...data,
        groupId: getGroupIdForRole(data.role),
        createdAt: user?.createdAt || new Date().toISOString(),
        licenseNumber: data.licenseNumber || undefined,
        totalTrips: data.totalTrips,
        lastTrip: data.lastTrip || undefined,
        profileImage: profileImage || undefined,
      };

      if (user) {
        console.log('Updating user:', user.id);
        await updateUser(user.id, userData);
      } else {
        console.log('Adding new user');
        await addUser(userData);
      }
      
      console.log('Submission successful, closing modal');
      
      // Reset states before closing
      setIsSubmitting(false);
      submissionInProgress.current = false;
      
      // Close modal
      onClose();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde de l\'utilisateur:', error);
      setIsSubmitting(false);
      submissionInProgress.current = false;
    }
  };

  const handleClose = () => {
    if (!isSubmitting && !submissionInProgress.current) {
      console.log('Closing modal via close button');
      onClose();
    } else {
      console.log('Close blocked - submission in progress');
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
