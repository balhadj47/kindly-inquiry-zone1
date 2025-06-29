
import { useState } from 'react';
import { useAllVans, useVanMutations } from '@/hooks/useVansOptimized';
import { useVansState } from '@/hooks/useVansState';
import { useCommonActions } from '@/hooks/useCommonActions';

export const useVansIndexState = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortField, setSortField] = useState('license_plate');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  
  // Get vans data with caching enabled
  const { data: vansData = [], refetch, isLoading, isError } = useAllVans();
  const { refreshVans } = useVanMutations();

  // Use consolidated refresh actions
  const { handleRefresh } = useCommonActions({
    refetch,
    onSuccess: refreshVans
  });

  const vansStateHook = useVansState(refreshVans);

  const handleModalSuccess = () => {
    refreshVans();
  };

  const handleQuickAction = (van: any) => {
    console.log('Quick action for van:', van);
    // This can be expanded later for specific quick actions
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
    refreshVans: handleRefresh,
    
    // Modal and action handlers
    ...vansStateHook,
    handleModalSuccess,
    handleQuickAction,
  };
};
