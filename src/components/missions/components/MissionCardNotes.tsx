
import React from 'react';
import { Trip } from '@/contexts/TripContext';

interface MissionCardNotesProps {
  mission: Trip;
}

const MissionCardNotes: React.FC<MissionCardNotesProps> = ({ mission }) => {
  if (!mission.notes) {
    return null;
  }

  return (
    <div className="mt-2 p-2 bg-amber-50 border border-amber-200 rounded text-xs">
      <span className="text-amber-800 truncate block">
        <span className="font-medium">Notes:</span> {mission.notes}
      </span>
    </div>
  );
};

export default MissionCardNotes;
