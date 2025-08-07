
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Truck } from 'lucide-react';
import { type Trip } from '@/contexts/TripContext';
import { type Van } from '@/types/van';
import { useIsMobile } from '@/hooks/use-mobile';

interface TripVanDetailsProps {
  trip: Trip;
  vans: Van[];
}

const TripVanDetails: React.FC<TripVanDetailsProps> = ({ trip, vans }) => {
  const isMobile = useIsMobile();

  const getVanDetails = (vanId: string) => {
    const van = vans.find(v => v.id === vanId);
    if (van) {
      return {
        model: van.model,
        licensePlate: van.license_plate,
        referenceCode: van.reference_code,
        status: van.status,
        displayName: van.reference_code 
          ? `${van.reference_code} - ${van.model}` 
          : van.license_plate 
            ? `${van.license_plate} - ${van.model}` 
            : van.model
      };
    }
    return {
      model: vanId,
      licensePlate: '',
      referenceCode: '',
      status: '',
      displayName: vanId
    };
  };

  const vanDetails = getVanDetails(trip.van);

  return (
    <Card>
      <CardContent className={isMobile ? 'p-3' : 'p-4'}>
        <h3 className={`${isMobile ? 'text-base' : 'text-lg'} font-semibold mb-3 flex items-center`}>
          <Truck className={`${isMobile ? 'h-4 w-4' : 'h-5 w-5'} mr-2 text-purple-600`} />
          Détails de la Camionnette
        </h3>
        
        <div className={`grid ${isMobile ? 'grid-cols-1 gap-3' : 'grid-cols-1 md:grid-cols-2 gap-4'}`}>
          {vanDetails.referenceCode && (
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <Truck className={`${isMobile ? 'h-3 w-3' : 'h-4 w-4'} text-indigo-600`} />
              </div>
              <div>
                <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-500`}>Code de référence</p>
                <p className={`${isMobile ? 'text-sm' : ''} font-semibold text-indigo-600`}>{vanDetails.referenceCode}</p>
              </div>
            </div>
          )}

          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Truck className={`${isMobile ? 'h-3 w-3' : 'h-4 w-4'} text-purple-600`} />
            </div>
            <div>
              <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-500`}>Modèle</p>
              <p className={`${isMobile ? 'text-sm' : ''} font-medium`}>{vanDetails.model}</p>
            </div>
          </div>

          {vanDetails.licensePlate && (
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Truck className={`${isMobile ? 'h-3 w-3' : 'h-4 w-4'} text-blue-600`} />
              </div>
              <div>
                <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-500`}>Plaque d'immatriculation</p>
                <p className={`${isMobile ? 'text-sm' : ''} font-medium`}>{vanDetails.licensePlate}</p>
              </div>
            </div>
          )}

          {vanDetails.status && (
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Truck className={`${isMobile ? 'h-3 w-3' : 'h-4 w-4'} text-orange-600`} />
              </div>
              <div>
                <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-500`}>Statut</p>
                <p className={`${isMobile ? 'text-sm' : ''} font-medium capitalize`}>{vanDetails.status}</p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TripVanDetails;
