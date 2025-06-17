
import React from 'react';
import { Calendar } from 'lucide-react';
import { type Trip } from '@/contexts/TripContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { useLanguage } from '@/contexts/LanguageContext';

interface TripDatesProps {
  trip: Trip;
}

const TripDates: React.FC<TripDatesProps> = ({ trip }) => {
  const isMobile = useIsMobile();
  const { t } = useLanguage();

  const formatDate = (date: Date | string | undefined) => {
    if (!date) return null;
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatTime = (date: Date | string | undefined) => {
    if (!date) return null;
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Show the component if either start or end date exists
  if (!trip.startDate && !trip.endDate) {
    return null;
  }

  return (
    <div className="bg-blue-50 p-3 sm:p-4 rounded-lg border border-blue-200">
      <div className="flex items-center gap-2 mb-3">
        <div className="p-1.5 bg-blue-100 rounded-lg">
          <Calendar className="h-4 w-4 text-blue-600" />
        </div>
        <h4 className={`${isMobile ? 'text-sm' : 'text-base'} font-semibold text-blue-900`}>
          {t.plannedDates}
        </h4>
      </div>

      <div className={`space-y-2 ${isMobile ? 'text-sm' : ''}`}>
        {trip.startDate && (
          <div className="flex items-center justify-between">
            <span className="text-blue-700 font-medium">{t.startDate}</span>
            <div className="text-right">
              <div className="text-blue-900 font-medium">{formatDate(trip.startDate)}</div>
              {formatTime(trip.startDate) && (
                <div className="text-blue-600 text-xs">{formatTime(trip.startDate)}</div>
              )}
            </div>
          </div>
        )}

        {trip.endDate && (
          <div className="flex items-center justify-between">
            <span className="text-blue-700 font-medium">{t.endDate}</span>
            <div className="text-right">
              <div className="text-blue-900 font-medium">{formatDate(trip.endDate)}</div>
              {formatTime(trip.endDate) && (
                <div className="text-blue-600 text-xs">{formatTime(trip.endDate)}</div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TripDates;
