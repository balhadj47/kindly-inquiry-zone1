
import React from 'react';
import { Van } from '@/types/van';
import VanListGrid from './VanListGrid';
import VanListSummary from './VanListSummary';
import VanListPagination from './VanListPagination';
import VansEmptyState from './VansEmptyState';

interface VansContentSectionProps {
  paginatedVans: Van[];
  filteredVansCount: number;
  currentPage: number;
  totalPages: number;
  searchTerm: string;
  onPageChange: (page: number) => void;
  onEditVan: (van: Van) => void;
  onDeleteVan: (van: Van) => void;
  onQuickAction: (van: Van) => void;
  onAddVan: () => void;
}

const VansContentSection: React.FC<VansContentSectionProps> = ({
  paginatedVans,
  filteredVansCount,
  currentPage,
  totalPages,
  searchTerm,
  onPageChange,
  onEditVan,
  onDeleteVan,
  onQuickAction,
  onAddVan
}) => {
  if (paginatedVans.length === 0 && filteredVansCount === 0) {
    return (
      <div className="flex-1 overflow-y-auto p-4 sm:p-6">
        <VansEmptyState 
          searchTerm={searchTerm} 
          onAddVan={onAddVan} 
        />
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="p-4 sm:p-6">
        <VanListSummary 
          displayedCount={paginatedVans.length}
          filteredCount={filteredVansCount}
          currentPage={currentPage}
          totalPages={totalPages}
        />
        
        <div className="mt-4">
          <VanListGrid 
            vans={paginatedVans}
            onEditVan={onEditVan}
            onDeleteVan={onDeleteVan}
            onQuickAction={onQuickAction}
          />
        </div>
        
        {totalPages > 1 && (
          <div className="mt-6 flex justify-center">
            <VanListPagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={onPageChange}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default VansContentSection;
