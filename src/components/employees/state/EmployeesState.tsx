
import { useState } from 'react';
import { User } from '@/types/rbac';
import { useEmployeeActions } from '@/hooks/useEmployeeActions';
import { useEmployeePermissions } from '@/hooks/useEmployeePermissions';
import { useCacheRefresh } from '@/hooks/useCacheRefresh';

export const useEmployeesState = (refetch: () => void) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const { refreshPage } = useCacheRefresh();
  
  const permissions = useEmployeePermissions();

  // Enhanced refresh function that forces cache invalidation
  const handleRefresh = async () => {
    await refreshPage(['users', 'role_id', '3']);
    await refetch();
  };

  const employeeActions = useEmployeeActions(handleRefresh);

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
  };

  return {
    // Filter state
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    clearFilters,
    
    // Actions
    handleRefresh,
    ...employeeActions,
    
    // Permissions
    permissions
  };
};
