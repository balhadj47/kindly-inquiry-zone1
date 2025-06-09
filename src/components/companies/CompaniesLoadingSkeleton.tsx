
import React from 'react';
import { Loader2 } from 'lucide-react';

const CompaniesLoadingSkeleton = () => {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="flex items-center gap-3">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
        <span className="text-lg font-medium text-muted-foreground animate-pulse">
          Chargement des entreprises...
        </span>
      </div>
    </div>
  );
};

export default CompaniesLoadingSkeleton;
