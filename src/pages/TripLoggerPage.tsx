
import React from 'react';
import TripLogger from '@/components/TripLogger';

const TripLoggerPage = () => {
  console.log('🚛 TripLoggerPage: Component is rendering');
  console.log('🚛 TripLoggerPage: Current URL:', window.location.pathname);
  
  return (
    <div className="container mx-auto px-4 py-8">
      <TripLogger />
    </div>
  );
};

export default TripLoggerPage;
