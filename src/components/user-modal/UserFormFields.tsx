
import React from 'react';
import { Control } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UserStatus } from '@/types/rbac';
import BasicInfoFields from './BasicInfoFields';
import DriverFields from './DriverFields';
import EmployeeFields from './EmployeeFields';
import SystemFields from './SystemFields';

interface UserFormFieldsProps {
  control: Control<any>;
  isSubmitting: boolean;
  watchedRoleId: number;
  watchedEmail: string;
  onEmailValidationChange: (isValid: boolean) => void;
  userId?: string;
  isEmailRequired?: boolean; // New prop to make email required
}

const UserFormFields: React.FC<UserFormFieldsProps> = ({
  control,
  isSubmitting,
  watchedRoleId,
  watchedEmail,
  onEmailValidationChange,
  userId,
  isEmailRequired = false, // Default to false for backward compatibility
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <BasicInfoFields 
        control={control} 
        isSubmitting={isSubmitting} 
        isEmailRequired={isEmailRequired}
      />
      
      <SystemFields 
        control={control} 
        isSubmitting={isSubmitting} 
        watchedRoleId={watchedRoleId}
        watchedEmail={watchedEmail}
        onEmailValidationChange={onEmailValidationChange}
        userId={userId}
      />
      
      {/* Conditionally render driver or employee fields based on role */}
      {watchedRoleId === 3 ? (
        <EmployeeFields control={control} isSubmitting={isSubmitting} />
      ) : (
        // Hide driver-specific fields in user creation (only show for actual drivers)
        <DriverFields 
          control={control} 
          isSubmitting={isSubmitting} 
          hideDriverSpecificFields={true}
        />
      )}
    </div>
  );
};

export default UserFormFields;
