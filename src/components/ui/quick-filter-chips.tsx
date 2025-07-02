
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FilterChip {
  key: string;
  label: string;
  value: string;
}

interface QuickFilterChipsProps {
  activeFilters: FilterChip[];
  onRemoveFilter: (key: string) => void;
  onClearAll: () => void;
  className?: string;
}

export const QuickFilterChips: React.FC<QuickFilterChipsProps> = ({
  activeFilters,
  onRemoveFilter,
  onClearAll,
  className
}) => {
  if (activeFilters.length === 0) return null;

  return (
    <div className={cn('flex flex-wrap items-center gap-2', className)}>
      <span className="text-sm text-gray-600 font-medium">Filtres actifs:</span>
      {activeFilters.map((filter) => (
        <Badge
          key={filter.key}
          variant="secondary"
          className="bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 pr-1"
        >
          <span className="mr-1">{filter.label}</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onRemoveFilter(filter.key)}
            className="h-4 w-4 p-0 hover:bg-blue-200 rounded-full"
          >
            <X className="h-3 w-3" />
          </Button>
        </Badge>
      ))}
      {activeFilters.length > 1 && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearAll}
          className="text-xs text-gray-500 hover:text-gray-700 h-6 px-2"
        >
          Tout effacer
        </Button>
      )}
    </div>
  );
};
