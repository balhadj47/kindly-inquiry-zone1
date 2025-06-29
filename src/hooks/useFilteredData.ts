
import { useMemo } from 'react';
import { useOptimizedSearch } from '@/hooks/useOptimizedSearch';

interface UseFilteredDataOptions<T> {
  data: T[];
  searchTerm: string;
  searchFields: (keyof T)[];
  statusFilter?: string;
  statusField?: keyof T;
  customFilters?: Record<string, any>;
  debounceMs?: number;
}

export const useFilteredData = <T extends Record<string, any>>({
  data,
  searchTerm,
  searchFields,
  statusFilter,
  statusField,
  customFilters,
  debounceMs = 300
}: UseFilteredDataOptions<T>) => {
  const { filteredData: searchFilteredData } = useOptimizedSearch({
    data,
    searchFields: searchFields as string[],
    debounceMs
  });

  const filteredData = useMemo(() => {
    let result = searchFilteredData;

    // Apply external search term if provided
    if (searchTerm && searchTerm.trim()) {
      const lowerSearch = searchTerm.toLowerCase();
      result = result.filter(item => 
        searchFields.some(field => {
          const value = item[field];
          return value && typeof value === 'string' && 
                 value.toLowerCase().includes(lowerSearch);
        })
      );
    }

    // Apply status filter
    if (statusFilter && statusFilter !== 'all' && statusField) {
      result = result.filter(item => {
        const status = item[statusField];
        if (statusFilter === 'active') {
          return status === 'active' || status === 'Active';
        }
        if (statusFilter === 'inactive') {
          return status === 'inactive' || status === 'Inactive';
        }
        if (statusFilter === 'completed') {
          return status === 'completed' || status === 'Completed';
        }
        if (statusFilter === 'terminated') {
          return status === 'terminated' || status === 'Terminated';
        }
        return status === statusFilter;
      });
    }

    // Apply custom filters
    if (customFilters) {
      result = result.filter(item => {
        return Object.entries(customFilters).every(([key, value]) => {
          if (value === null || value === undefined || value === 'all') return true;
          return item[key] === value;
        });
      });
    }

    return result;
  }, [searchFilteredData, searchTerm, searchFields, statusFilter, statusField, customFilters]);

  return {
    filteredData,
    totalCount: data.length,
    filteredCount: filteredData.length
  };
};
