
import { useMemo } from 'react';
import { Van } from '@/types/van';

interface UseVansFilteringProps {
  vansData: Van[];
  searchTerm: string;
  statusFilter: string;
  sortField: string;
  sortDirection: 'asc' | 'desc';
}

export const useVansFiltering = ({
  vansData,
  searchTerm,
  statusFilter,
  sortField,
  sortDirection
}: UseVansFilteringProps) => {
  const filteredAndSortedVans = useMemo(() => {
    console.log('Filtering vans:', { vans: vansData?.length || 0, statusFilter, searchTerm });
    
    if (!vansData || vansData.length === 0) {
      return [];
    }
    
    let filtered = vansData.filter(van => {
      // Search filter - now includes reference_code
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = !searchTerm || 
        van.license_plate?.toLowerCase().includes(searchLower) ||
        van.model?.toLowerCase().includes(searchLower) ||
        van.reference_code?.toLowerCase().includes(searchLower);

      // Status filter - make sure we're comparing the exact values
      const matchesStatus = statusFilter === 'all' || van.status === statusFilter;
      
      // Enhanced debugging for search issues
      if (searchTerm && (van.reference_code?.toLowerCase().includes(searchLower) || 
                        van.license_plate?.toLowerCase().includes(searchLower) || 
                        van.model?.toLowerCase().includes(searchLower))) {
        console.log('🔍 Search match found:', { 
          vanId: van.id, 
          license_plate: van.license_plate,
          model: van.model,
          reference_code: van.reference_code,
          searchTerm,
          matchesSearch,
          matchesStatus,
          vanStatus: van.status,
          statusFilter
        });
      }

      return matchesSearch && matchesStatus;
    });

    console.log('Filtered vans result:', { 
      searchTerm, 
      statusFilter, 
      totalVans: vansData.length, 
      filteredCount: filtered.length,
      filteredVanIds: filtered.map(v => ({ id: v.id, ref: v.reference_code, plate: v.license_plate }))
    });

    // Sort the filtered results
    filtered.sort((a, b) => {
      let aValue = '';
      let bValue = '';

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
        case 'insurer':
          aValue = a.insurer || '';
          bValue = b.insurer || '';
          break;
        case 'created_at':
          aValue = a.created_at || '';
          bValue = b.created_at || '';
          break;
        default:
          aValue = a.license_plate || '';
          bValue = b.license_plate || '';
      }

      if (sortField === 'created_at') {
        // For dates, convert to Date objects for proper comparison
        const dateA = new Date(aValue);
        const dateB = new Date(bValue);
        return sortDirection === 'asc' 
          ? dateA.getTime() - dateB.getTime()
          : dateB.getTime() - dateA.getTime();
      } else {
        // For strings, use localeCompare
        const comparison = aValue.localeCompare(bValue);
        return sortDirection === 'asc' ? comparison : -comparison;
      }
    });

    return filtered;
  }, [vansData, searchTerm, statusFilter, sortField, sortDirection]);

  return filteredAndSortedVans;
};
