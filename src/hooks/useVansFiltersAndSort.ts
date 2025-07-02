
import { useMemo } from 'react';
import { Van } from '@/types/van';

interface UseVansFiltersAndSortProps {
  vans: Van[];
  searchTerm: string;
  statusFilter: string;
  sortField: string;
  sortDirection: 'asc' | 'desc';
}

export const useVansFiltersAndSort = ({
  vans,
  searchTerm,
  statusFilter,
  sortField,
  sortDirection
}: UseVansFiltersAndSortProps) => {
  const filteredAndSortedVans = useMemo(() => {
    console.log('🔍 useVansFiltersAndSort: Processing vans:', {
      totalVans: vans.length,
      searchTerm,
      statusFilter,
      sortField,
      sortDirection
    });

    // Filter vans
    let filtered = vans.filter(van => {
      // Search filter - check license_plate, model, and reference_code
      const matchesSearch = !searchTerm || 
        van.license_plate?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        van.model?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        van.reference_code?.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Status filter
      const matchesStatus = statusFilter === 'all' || van.status === statusFilter;
      
      console.log('🔍 Van filter check:', {
        vanId: van.id,
        license_plate: van.license_plate,
        model: van.model,
        reference_code: van.reference_code,
        status: van.status,
        searchTerm,
        matchesSearch,
        matchesStatus
      });
      
      return matchesSearch && matchesStatus;
    });

    // Sort vans
    filtered.sort((a, b) => {
      let aValue: string | number = '';
      let bValue: string | number = '';

      switch (sortField) {
        case 'license_plate':
          aValue = a.license_plate || '';
          bValue = b.license_plate || '';
          break;
        case 'model':
          aValue = a.model || '';
          bValue = b.model || '';
          break;
        case 'reference_code':
          aValue = a.reference_code || '';
          bValue = b.reference_code || '';
          break;
        case 'created_at':
          aValue = a.created_at || '';
          bValue = b.created_at || '';
          break;
        default:
          aValue = a.license_plate || '';
          bValue = b.license_plate || '';
      }

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        const comparison = aValue.localeCompare(bValue);
        return sortDirection === 'asc' ? comparison : -comparison;
      }

      return 0;
    });

    console.log('🔍 useVansFiltersAndSort: Final result:', {
      filteredCount: filtered.length,
      firstFewVans: filtered.slice(0, 3).map(v => ({
        license_plate: v.license_plate,
        model: v.model,
        reference_code: v.reference_code
      }))
    });

    return filtered;
  }, [vans, searchTerm, statusFilter, sortField, sortDirection]);

  return { filteredAndSortedVans };
};
