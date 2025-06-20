
import React from 'react';
import TripHistoryContainer from '@/components/trip-history/TripHistoryContainer';
import ProgressiveLoadingWrapper from '@/components/ProgressiveLoadingWrapper';

const TripHistoryPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Historique des Missions</h1>
          <p className="text-gray-500 mt-2">Consultez l'historique complet de toutes les missions</p>
        </div>
        
        <ProgressiveLoadingWrapper>
          <TripHistoryContainer />
        </ProgressiveLoadingWrapper>
      </div>
    </div>
  );
};

export default TripHistoryPage;
