
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { FileText } from 'lucide-react';
import { type Trip } from '@/contexts/TripContext';
import { useIsMobile } from '@/hooks/use-mobile';

interface TripNotesProps {
  trip: Trip;
}

const TripNotes: React.FC<TripNotesProps> = ({ trip }) => {
  const isMobile = useIsMobile();

  if (!trip.notes) return null;

  return (
    <Card>
      <CardContent className={isMobile ? 'p-3' : 'p-4'}>
        <h3 className={`${isMobile ? 'text-base' : 'text-lg'} font-semibold mb-3 flex items-center`}>
          <FileText className={`${isMobile ? 'h-4 w-4' : 'h-5 w-5'} mr-2 text-gray-600`} />
          Notes
        </h3>
        <div className={`bg-gray-50 p-2 ${isMobile ? 'p-2' : 'p-3'} rounded-lg`}>
          <p className={`${isMobile ? 'text-sm' : ''} text-gray-700 whitespace-pre-wrap`}>{trip.notes}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default TripNotes;
