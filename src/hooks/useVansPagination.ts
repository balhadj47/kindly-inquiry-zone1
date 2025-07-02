
import { useState, useMemo } from 'react';
import { Van } from '@/types/van';

interface UseVansPaginationProps {
  filteredVans: Van[];
  itemsPerPage?: number;
  searchTerm?: string;
  statusFilter?: string;
}

export const useVansPagination = (filteredVans: Van[], itemsPerPage: number = 12) => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(filteredVans.length / itemsPerPage);
  
  const paginatedVans = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredVans.slice(startIndex, endIndex);
  }, [filteredVans, currentPage, itemsPerPage]);

  const startIndex = (currentPage - 1) * itemsPerPage + 1;
  const endIndex = Math.min(currentPage * itemsPerPage, filteredVans.length);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return {
    currentPage,
    setCurrentPage,
    totalPages,
    paginatedVans,
    startIndex,
    endIndex,
    handlePageChange,
  };
};
