
import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import CurrentTimeCard from './CurrentTimeCard';
import TripLoggerForm from './TripLoggerForm';
import QuickStatsSection from './QuickStatsSection';

const TripLogger = () => {
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const { t } = useLanguage();

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900">{t.tripLogger}</h1>
        <p className="text-gray-500 mt-2">{t.recordVanVisits}</p>
      </div>

      <CurrentTimeCard />

      <TripLoggerForm 
        userSearchQuery={userSearchQuery}
        setUserSearchQuery={setUserSearchQuery}
      />

      <QuickStatsSection />
    </div>
  );
};

export default TripLogger;
