
import React from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface TripDetailsStepProps {
  notes: string;
  onNotesChange: (notes: string) => void;
}

const TripDetailsStep: React.FC<TripDetailsStepProps> = ({
  notes,
  onNotesChange
}) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Détails du voyage</h3>
        <div>
          <Label htmlFor="notes">Notes</Label>
          <Textarea
            id="notes"
            placeholder="Ajoutez des notes sur le voyage..."
            value={notes}
            onChange={(e) => onNotesChange(e.target.value)}
            rows={4}
          />
        </div>
      </div>
    </div>
  );
};

export default TripDetailsStep;
