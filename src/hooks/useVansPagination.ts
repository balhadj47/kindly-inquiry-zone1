
import { useState, useCallback, useEffect, useMemo } from 'react';
import { Van } from '@/types/van';

interface UseVansPaginationProps {
  filteredVans: Van[];
  itemsPerPage: number;
  searchTerm: string;
  statusFilter: string;
}

export const useVansPagination = ({
  filteredVans,
  itemsPerPage,
  searchTerm,
  statusFilter,
}: UseVansPaginationProps) => {
  const [currentPage, setCurrentPage] = useState(1);

  // Safe page change handler
  const handlePageChange = useCallback((page: number) => {
    try {
      const safePage = Math.max(1, Math.floor(page));
      setCurrentPage(safePage);
    } catch (error) {
      console.error('Error changing page:', error);
    }
  }, []);

  // Reset to first page when filters change
  useEffect(() => {
    console.log('useVansPagination - Resetting to page 1 due to filter change');
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  // Calculate pagination safely
  const pagination = useMemo(() => {
    const totalPages = Math.max(1, Math.ceil(filteredVans.length / itemsPerPage));
    const safeCurrentPage = Math.min(Math.max(1, currentPage), totalPages);
    const startIndex = (safeCurrentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedVans = filteredVans.slice(startIndex, endIndex);

    return {
      currentPage: safeCurrentPage,
      totalPages,
      paginatedVans,
    };
  }, [filteredVans, itemsPerPage, currentPage]);

  return {
    ...pagination,
    handlePageChange,
  };
};
