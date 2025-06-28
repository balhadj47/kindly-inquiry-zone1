
import { useState, useMemo, useCallback } from 'react';
import { useDebounce } from './useDebounce';

interface UseOptimizedSearchProps<T> {
  data: T[];
  searchFields: (keyof T)[];
  debounceMs?: number;
}

export const useOptimizedSearch = <T extends Record<string, any>>({
  data,
  searchFields,
  debounceMs = 300
}: UseOptimizedSearchProps<T>) => {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, debounceMs);

  const filteredData = useMemo(() => {
    if (!debouncedSearchTerm.trim()) {
      return data;
    }

    const lowerCaseSearch = debouncedSearchTerm.toLowerCase();
    
    return data.filter(item => 
      searchFields.some(field => {
        const value = item[field];
        if (typeof value === 'string') {
          return value.toLowerCase().includes(lowerCaseSearch);
        }
        if (typeof value === 'number') {
          return value.toString().includes(lowerCaseSearch);
        }
        return false;
      })
    );
  }, [data, debouncedSearchTerm, searchFields]);

  const clearSearch = useCallback(() => {
    setSearchTerm('');
  }, []);

  return {
    searchTerm,
    setSearchTerm,
    filteredData,
    clearSearch,
    isSearching: searchTerm !== debouncedSearchTerm
  };
};
