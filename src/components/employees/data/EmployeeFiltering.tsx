
import { useMemo } from 'react';
import { User } from '@/types/rbac';

interface FilteredEmployeeData {
  filteredEmployees: User[];
  filterStats: {
    totalCount: number;
    filteredCount: number;
    hasActiveFilters: boolean;
  };
}

export const useEmployeeFiltering = (
  employees: User[],
  searchTerm: string,
  statusFilter: string
): FilteredEmployeeData => {
  const filteredData = useMemo(() => {
    if (!employees || employees.length === 0) {
      return {
        filteredEmployees: [],
        filterStats: {
          totalCount: 0,
          filteredCount: 0,
          hasActiveFilters: false
        }
      };
    }

    const hasActiveFilters = Boolean(searchTerm) || statusFilter !== 'all';
    
    const filtered = employees.filter(employee => {
      // Search filter
      const matchesSearch = !searchTerm || 
        employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.badgeNumber?.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Status filter
      const matchesStatus = statusFilter === 'all' || employee.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });

    return {
      filteredEmployees: filtered,
      filterStats: {
        totalCount: employees.length,
        filteredCount: filtered.length,
        hasActiveFilters
      }
    };
  }, [employees, searchTerm, statusFilter]);

  return filteredData;
};
