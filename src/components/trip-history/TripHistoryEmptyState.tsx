
import React from 'react';
import { Truck } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface TripHistoryEmptyStateProps {
  filteredTripsCount: number;
  totalTripsCount: number;
}

const TripHistoryEmptyState: React.FC<TripHistoryEmptyStateProps> = ({
  filteredTripsCount,
  totalTripsCount
}) => {
  const { t } = useLanguage();

  return (
    <div className="text-center py-12">
      <Truck className="h-12 w-12 text-gray-400 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">{t.noTripsFoundFull}</h3>
      <p className="text-gray-600">
        {totalTripsCount === 0 
          ? t.noTripsRecorded
          : t.noTripsMatchFilters
        }
      </p>
    </div>
  );
};

export default TripHistoryEmptyState;
