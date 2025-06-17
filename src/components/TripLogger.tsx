
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCompanies } from '@/hooks/useCompanies';
import { useVans } from '@/hooks/useVans';
import TripLoggerForm from './TripLoggerForm';
import QuickStatsSection from './QuickStatsSection';
import TripLoggerLoadingSkeleton from './TripLoggerLoadingSkeleton';

const TripLogger = () => {
  const { t } = useLanguage();
  const { companies } = useCompanies();
  const { vans } = useVans();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900">{t.tripLogger}</h1>
        <p className="text-gray-500 mt-2">{t.recordVanVisits}</p>
      </div>

      <TripLoggerForm />

      <QuickStatsSection />
    </div>
  );
};

export default TripLogger;
