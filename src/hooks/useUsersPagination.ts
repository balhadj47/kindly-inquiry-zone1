
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
    console.log('useUsersPagination - Resetting to page 1 due to filter change');
    setCurrentPage(1);
  }, [searchTerm, statusFilter, roleFilter, view]);

  // Calculate pagination safely
  const pagination = useMemo(() => {
    const totalPages = Math.max(1, Math.ceil(filteredUsers.length / itemsPerPage));
    const safeCurrentPage = Math.min(Math.max(1, currentPage), totalPages);
    const startIndex = (safeCurrentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
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
