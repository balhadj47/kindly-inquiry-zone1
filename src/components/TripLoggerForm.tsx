
import React from 'react';
import { TripFormProvider } from './trip-logger/TripFormProvider';
import { TripFormWizard } from './trip-logger/TripFormWizard';

const TripLoggerForm = () => {
  return (
    <TripFormProvider>
      <TripFormWizard />
    </TripFormProvider>
  );
};

export default TripLoggerForm;
