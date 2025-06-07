
import { useState } from 'react';

export interface TripFormData {
  vanId: string;
  selectedUserIds: string[];
  companyId: string;
  branchId: string;
  notes: string;
}

export const useTripForm = () => {
  const [formData, setFormData] = useState<TripFormData>({
    vanId: '',
    selectedUserIds: [],
    companyId: '',
    branchId: '',
    notes: '',
  });

  const handleInputChange = (field: keyof TripFormData, value: string | string[]) => {
    if (field === 'companyId') {
      // Reset branch when company changes
      setFormData(prev => ({ ...prev, [field]: value as string, branchId: '' }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleUserSelection = (userId: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      selectedUserIds: checked 
        ? [...prev.selectedUserIds, userId]
        : prev.selectedUserIds.filter(id => id !== userId)
    }));
  };

  const resetForm = () => {
    setFormData({
      vanId: '',
      selectedUserIds: [],
      companyId: '',
      branchId: '',
      notes: '',
    });
  };

  return {
    formData,
    handleInputChange,
    handleUserSelection,
    resetForm,
  };
};
