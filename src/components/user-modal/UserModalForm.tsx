
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
  const isMountedRef = useRef(true);
  
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

  // Track component mount status
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Reset form and state when modal opens/closes or user changes
  useEffect(() => {
    if (isOpen) {
      if (user) {
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
    
    // Reset submitting state when modal state changes
    if (!isOpen) {
      setIsSubmitting(false);
    }
  }, [user, form, isOpen]);

  const handleImageChange = (image: string) => {
    setProfileImage(image);
    form.setValue('profileImage', image);
  };

  const handleSubmit = async (data: UserFormData) => {
    if (isSubmitting || !isMountedRef.current) return;
    
    setIsSubmitting(true);
    
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
        await updateUser(user.id, userData);
      } else {
        await addUser(userData);
      }
      
      // Only close if component is still mounted
      if (isMountedRef.current) {
        onClose();
      }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde de l\'utilisateur:', error);
    } finally {
      // Only update state if component is still mounted
      if (isMountedRef.current) {
        setIsSubmitting(false);
      }
    }
  };

  const handleClose = () => {
    if (!isSubmitting && isMountedRef.current) {
      onClose();
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
