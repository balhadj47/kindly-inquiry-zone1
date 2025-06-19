
import React from 'react';
import TripHistoryLayout from './trip-history/TripHistoryLayout';
import TripHistoryContainer from './trip-history/TripHistoryContainer';

const TripHistoryOptimized = () => {
  return (
    <TripHistoryLayout>
      <TripHistoryContainer />
    </TripHistoryLayout>
  );
};

export default TripHistoryOptimized;
