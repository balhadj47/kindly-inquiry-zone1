
import { useState } from 'react';
import { useAllVans, useVanMutations } from '@/hooks/useVansOptimized';
import { useVansState } from '@/hooks/useVansState';

export const useVansIndexState = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortField, setSortField] = useState('license_plate');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  
  // Get vans data with caching enabled
  const { data: vansData = [], refetch, isLoading, isError } = useAllVans();
  const { invalidateVans, refreshVans } = useVanMutations();

  const setVans = () => {
    refreshVans();
  };

  const vansStateHook = useVansState(setVans);

  const handleModalSuccess = () => {
    refreshVans();
  };

  const handleQuickAction = (van: any) => {
    console.log('Quick action for van:', van);
  };

  return {
    // Search and filter state
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    sortField,
    setSortField,
    sortDirection,
    setSortDirection,
    
    // Data state
    vansData,
    isLoading,
    isError,
    refreshVans,
    
    // Modal and action handlers
    ...vansStateHook,
    handleModalSuccess,
    handleQuickAction,
  };
};
