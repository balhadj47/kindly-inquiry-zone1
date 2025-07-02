
import React from 'react';
import { FileText } from 'lucide-react';
import { Trip } from '@/contexts/TripContext';

interface MissionNotesProps {
  mission: Trip;
}

const MissionNotes: React.FC<MissionNotesProps> = ({ mission }) => {
  if (!mission.notes) {
    return null;
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6">
      <div className="flex items-center gap-3 mb-4">
        <FileText className="h-5 w-5 text-amber-600" />
        <h3 className="text-lg font-semibold text-gray-900">Notes</h3>
      </div>
      <p className="text-gray-700 leading-relaxed">{mission.notes}</p>
    </div>
  );
};

export default MissionNotes;
