
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
    <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
      <p className="text-sm text-amber-800">
        <span className="font-medium">Notes:</span> {mission.notes}
      </p>
    </div>
  );
};

export default MissionCardNotes;
