
import { useState } from 'react';
import { MissionRole } from '@/components/RoleSelectionSection';

export interface UserWithRoles {
  userId: string;
  roles: MissionRole[];
}

export interface TripFormData {
  vanId: string;
  selectedUsersWithRoles: UserWithRoles[];
  companyId: string;
  branchId: string;
  notes: string;
}

export const useTripForm = () => {
  const [formData, setFormData] = useState<TripFormData>({
    vanId: '',
    selectedUsersWithRoles: [],
    companyId: '',
    branchId: '',
    notes: '',
  });

  const handleInputChange = (field: keyof Omit<TripFormData, 'selectedUsersWithRoles'>, value: string) => {
    if (field === 'companyId') {
      // Reset branch when company changes
      setFormData(prev => ({ ...prev, [field]: value, branchId: '' }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleUserRoleSelection = (userId: string, roles: MissionRole[]) => {
    setFormData(prev => {
      const existingUserIndex = prev.selectedUsersWithRoles.findIndex(u => u.userId === userId);
      
      if (roles.length === 0) {
        // Remove user if no roles selected
        return {
          ...prev,
          selectedUsersWithRoles: prev.selectedUsersWithRoles.filter(u => u.userId !== userId)
        };
      }
      
      if (existingUserIndex >= 0) {
        // Update existing user's roles
        const updatedUsers = [...prev.selectedUsersWithRoles];
        updatedUsers[existingUserIndex] = { userId, roles };
        return {
          ...prev,
          selectedUsersWithRoles: updatedUsers
        };
      } else {
        // Add new user with roles
        return {
          ...prev,
          selectedUsersWithRoles: [...prev.selectedUsersWithRoles, { userId, roles }]
        };
      }
    });
  };

  const resetForm = () => {
    setFormData({
      vanId: '',
      selectedUsersWithRoles: [],
      companyId: '',
      branchId: '',
      notes: '',
    });
  };

  // Helper function to get trip data in the format expected by TripContext
  const getTripData = (driver: string) => ({
    van: formData.vanId,
    driver,
    company: formData.companyId,
    branch: formData.branchId,
    notes: formData.notes,
    userIds: formData.selectedUsersWithRoles.map(u => u.userId), // Keep backward compatibility
    userRoles: formData.selectedUsersWithRoles, // New field for role information
  });

  return {
    formData,
    handleInputChange,
    handleUserRoleSelection,
    resetForm,
    getTripData,
  };
};
