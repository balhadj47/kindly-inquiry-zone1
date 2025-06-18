
import React from 'react';

interface VanListSummaryProps {
  displayedCount: number;
  filteredCount: number;
  currentPage: number;
  totalPages: number;
}

const VanListSummary = ({ displayedCount, filteredCount, currentPage, totalPages }: VanListSummaryProps) => {
  return (
    <div className="flex items-center justify-between">
      <div className="text-sm text-muted-foreground">
        Affichage de <span className="font-medium text-foreground">{displayedCount}</span> sur{' '}
        <span className="font-medium text-foreground">{filteredCount}</span> camionnettes
      </div>
      <div className="text-xs text-muted-foreground">
        Page {currentPage} sur {totalPages}
      </div>
    </div>
  );
};

export default VanListSummary;
