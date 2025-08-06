
import { useState } from 'react';
import { useTripForm } from '@/hooks/useTripForm';

export const useTripFormState = () => {
  const { formData, handleInputChange, handleDateChange, handleUserRoleSelection, resetForm } = useTripForm();
  const [userSearchQuery, setUserSearchQuery] = useState('');

  return {
    formData,
    handleInputChange,
    handleDateChange,
    handleUserRoleSelection,
    resetForm,
    userSearchQuery,
    setUserSearchQuery,
  };
};
