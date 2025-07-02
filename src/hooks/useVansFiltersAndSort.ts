
import { useMemo } from 'react';
import { Van } from '@/types/van';

interface UseVansFiltersAndSortParams {
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
}: UseVansFiltersAndSortParams) => {
  const filteredAndSortedVans = useMemo(() => {
    let filtered = vans.filter(van => {
      if (!van || typeof van !== 'object') return false;
      const licensePlateStr = typeof van.license_plate === 'string' ? van.license_plate : '';
      const modelStr = typeof van.model === 'string' ? van.model : '';
      return (
        licensePlateStr.toLowerCase().includes(searchTerm.toLowerCase()) ||
        modelStr.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });

    if (statusFilter !== 'all') {
      filtered = filtered.filter(van => {
        const vanStatus = typeof van.status === 'string' ? van.status : 'Active';
        return vanStatus === statusFilter;
      });
    }

    return filtered.sort((a, b) => {
      const direction = sortDirection === 'asc' ? 1 : -1;
      let aVal: string = '', bVal: string = '';
      switch (sortField) {
        case 'model':
          aVal = typeof a.model === 'string' ? a.model : '';
          bVal = typeof b.model === 'string' ? b.model : '';
          return direction * aVal.localeCompare(bVal);
        case 'status':
          aVal = typeof a.status === 'string' ? a.status : 'Active';
          bVal = typeof b.status === 'string' ? b.status : 'Active';
          return direction * aVal.localeCompare(bVal);
        case 'license_plate':
        default:
          aVal = typeof a.license_plate === 'string' ? a.license_plate : '';
          bVal = typeof b.license_plate === 'string' ? b.license_plate : '';
          return direction * aVal.localeCompare(bVal);
      }
    });
  }, [vans, searchTerm, statusFilter, sortField, sortDirection]);

  return { filteredAndSortedVans };
};
