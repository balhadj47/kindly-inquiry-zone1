
import { useState, useCallback, useEffect, useMemo } from 'react';
import { User } from '@/types/rbac';

interface UseUsersPaginationProps {
  filteredUsers: User[];
  itemsPerPage: number;
  searchTerm: string;
  statusFilter: string;
  roleFilter: string;
  view: 'grid' | 'table';
}

export const useUsersPagination = ({
  filteredUsers,
  itemsPerPage,
  searchTerm,
  statusFilter,
  roleFilter,
  view,
}: UseUsersPaginationProps) => {
  const [currentPage, setCurrentPage] = useState(1);

  // Memoize filter dependencies to optimize useEffect
  const filterDependencies = useMemo(() => ({
    searchTerm,
    statusFilter,
    roleFilter,
    view
  }), [searchTerm, statusFilter, roleFilter, view]);

  // Safe page change handler
  const handlePageChange = useCallback((page: number) => {
    try {
      const safePage = Math.max(1, Math.floor(page));
      setCurrentPage(safePage);
    } catch (error) {
      console.error('Error changing page:', error);
    }
  }, []);

  // Reset to first page when filters change - optimized with memoized dependencies
  useEffect(() => {
    console.log('useUsersPagination - Resetting to page 1 due to filter change');
    setCurrentPage(1);
  }, [filterDependencies]);

  // Calculate pagination safely with optimized calculations
  const pagination = useMemo(() => {
    const safeItemsPerPage = Math.max(1, itemsPerPage);
    const totalPages = Math.max(1, Math.ceil(filteredUsers.length / safeItemsPerPage));
    const safeCurrentPage = Math.min(Math.max(1, currentPage), totalPages);
    const startIndex = (safeCurrentPage - 1) * safeItemsPerPage;
    const endIndex = startIndex + safeItemsPerPage;
    const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

    return {
      currentPage: safeCurrentPage,
      totalPages,
      paginatedUsers,
    };
  }, [filteredUsers, itemsPerPage, currentPage]);

  return {
    ...pagination,
    handlePageChange,
  };
};
