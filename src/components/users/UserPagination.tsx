
import React from 'react';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

interface UserPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems: number;
  itemsPerPage: number;
}

const UserPagination: React.FC<UserPaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  itemsPerPage,
}) => {
  // Add comprehensive safety checks
  const safeCurrentPage = Math.max(1, Math.floor(currentPage) || 1);
  const safeTotalPages = Math.max(1, Math.floor(totalPages) || 1);
  const safeTotalItems = Math.max(0, Math.floor(totalItems) || 0);
  const safeItemsPerPage = Math.max(1, Math.floor(itemsPerPage) || 1);

  // Calculate safe pagination values
  const startItem = safeTotalItems > 0 ? (safeCurrentPage - 1) * safeItemsPerPage + 1 : 0;
  const endItem = Math.min(safeCurrentPage * safeItemsPerPage, safeTotalItems);

  // Safe page change handler
  const handlePageChange = (page: number) => {
    try {
      const safePage = Math.max(1, Math.min(page, safeTotalPages));
      if (safePage !== safeCurrentPage && typeof onPageChange === 'function') {
        onPageChange(safePage);
      }
    } catch (error) {
      console.error('Error changing page:', error);
    }
  };

  const getVisiblePages = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    // Handle edge cases
    if (safeTotalPages <= 1) return [1];
    if (safeTotalPages <= 7) {
      for (let i = 1; i <= safeTotalPages; i++) {
        rangeWithDots.push(i);
      }
      return rangeWithDots;
    }

    // Calculate range for larger page counts
    for (let i = Math.max(2, safeCurrentPage - delta); i <= Math.min(safeTotalPages - 1, safeCurrentPage + delta); i++) {
      range.push(i);
    }

    if (safeCurrentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (safeCurrentPage + delta < safeTotalPages - 1) {
      rangeWithDots.push('...', safeTotalPages);
    } else if (safeTotalPages > 1) {
      rangeWithDots.push(safeTotalPages);
    }

    return rangeWithDots;
  };

  // Don't render if no items or only one page
  if (safeTotalItems === 0 || safeTotalPages <= 1) return null;

  console.log('UserPagination - Rendering with safe values:', {
    currentPage: safeCurrentPage,
    totalPages: safeTotalPages,
    totalItems: safeTotalItems,
    itemsPerPage: safeItemsPerPage,
    startItem,
    endItem
  });

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
      <div className="text-sm text-muted-foreground">
        {startItem > 0 ? (
          <>Affichage de {startItem} à {endItem} sur {safeTotalItems} utilisateurs</>
        ) : (
          <>Aucun utilisateur à afficher</>
        )}
      </div>
      
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious 
              onClick={() => handlePageChange(safeCurrentPage - 1)}
              className={safeCurrentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
            />
          </PaginationItem>

          {getVisiblePages().map((page, index) => (
            <PaginationItem key={`${page}-${index}`}>
              {page === '...' ? (
                <PaginationEllipsis />
              ) : (
                <PaginationLink
                  onClick={() => handlePageChange(page as number)}
                  isActive={safeCurrentPage === page}
                  className="cursor-pointer"
                >
                  {page}
                </PaginationLink>
              )}
            </PaginationItem>
          ))}

          <PaginationItem>
            <PaginationNext 
              onClick={() => handlePageChange(safeCurrentPage + 1)}
              className={safeCurrentPage === safeTotalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};

export default UserPagination;
