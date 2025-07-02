
import { useState } from 'react';

export const useVansFiltering = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
  };

  return {
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    clearFilters,
  };
};
