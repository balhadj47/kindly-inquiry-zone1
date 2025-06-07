
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTripContext } from '@/contexts/TripContext';

const QuickStatsSection = () => {
  const { t } = useLanguage();
  const { trips } = useTripContext();

  // Calculate today's trips
  const today = new Date().toISOString().split('T')[0];
  const todaysTrips = trips.filter(trip => trip.timestamp.startsWith(today));

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="text-center">
        <CardContent className="pt-6">
          <div className="text-2xl font-bold text-blue-600">{todaysTrips.length}</div>
          <div className="text-sm text-gray-600">{t.tripsToday}</div>
        </CardContent>
      </Card>
      <Card className="text-center">
        <CardContent className="pt-6">
          <div className="text-2xl font-bold text-green-600">
            {new Set(trips.map(t => t.van)).size}
          </div>
          <div className="text-sm text-gray-600">{t.activeVans}</div>
        </CardContent>
      </Card>
      <Card className="text-center">
        <CardContent className="pt-6">
          <div className="text-2xl font-bold text-purple-600">
            {new Set(trips.map(t => t.company)).size}
          </div>
          <div className="text-sm text-gray-600">{t.totalBranches}</div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuickStatsSection;
