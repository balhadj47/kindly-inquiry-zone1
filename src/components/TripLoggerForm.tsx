
import React from 'react';
import { TripFormProvider } from './trip-logger/TripFormProvider';
import { TripFormWizard } from './trip-logger/TripFormWizard';

const TripLoggerForm = () => {
  const handleSuccess = () => {
    // Handle successful trip creation
    console.log('Trip created successfully');
  };

  return (
    <TripFormProvider>
      <TripFormWizard onSuccess={handleSuccess} />
    </TripFormProvider>
  );
};

export default TripLoggerForm;
