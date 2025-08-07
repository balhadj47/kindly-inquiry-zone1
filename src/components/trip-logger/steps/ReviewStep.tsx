
import React from 'react';
import { CheckCircle } from 'lucide-react';
import { TripFormData } from '@/hooks/useTripForm';

interface ReviewStepProps extends TripFormData {
}

const ReviewStep: React.FC<ReviewStepProps> = (props) => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-3">
          <CheckCircle className="w-6 h-6 text-green-600" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">Révision</h3>
        <p className="text-gray-600">Vérifiez les détails de la mission</p>
      </div>
      {/* Review content would go here */}
    </div>
  );
};

export default ReviewStep;
