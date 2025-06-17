
import { useState } from 'react';
import { MissionRole } from '@/types/missionRoles';

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
  startKm: string;
  startDate: Date | undefined;
  endDate: Date | undefined;
}

export const useTripForm = () => {
  const [formData, setFormData] = useState<TripFormData>({
    vanId: '',
    selectedUsersWithRoles: [],
    companyId: '',
    branchId: '',
    notes: '',
    startKm: '',
    startDate: undefined,
    endDate: undefined,
  });

  const handleInputChange = (field: keyof Omit<TripFormData, 'selectedUsersWithRoles' | 'startDate' | 'endDate'>, value: string) => {
    if (field === 'companyId') {
      // Reset branch when company changes
      setFormData(prev => ({ ...prev, [field]: value, branchId: '' }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleDateChange = (field: 'startDate' | 'endDate', value: Date | undefined) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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
      startKm: '',
      startDate: undefined,
      endDate: undefined,
    });
  };

  // Helper function to get trip data in the format expected by TripContext
  const getTripData = (driver: string) => ({
    van: formData.vanId,
    driver,
    company: formData.companyId,
    branch: formData.branchId,
    notes: formData.notes,
    userIds: formData.selectedUsersWithRoles.map(u => u.userId),
    userRoles: formData.selectedUsersWithRoles,
    startKm: parseInt(formData.startKm) || 0,
    startDate: formData.startDate,
    endDate: formData.endDate,
  });

  return {
    formData,
    handleInputChange,
    handleDateChange,
    handleUserRoleSelection,
    resetForm,
    getTripData,
  };
};
