import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, Clock, Building2 } from 'lucide-react';
import { type Trip } from '@/contexts/TripContext';
import { useLanguage } from '@/contexts/LanguageContext';

interface TripHistoryStatsProps {
  trips: Trip[];
}

const TripHistoryStats: React.FC<TripHistoryStatsProps> = ({ trips }) => {
  const { t } = useLanguage();

  const todayTrips = trips.filter(trip => {
    const tripDate = new Date(trip.timestamp).toDateString();
    const today = new Date().toDateString();
    return tripDate === today;
  }).length;

  const thisWeekTrips = trips.filter(trip => {
    const tripDate = new Date(trip.timestamp);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return tripDate >= weekAgo;
  }).length;

  const totalVisitedCompanies = new Set(trips.map(trip => trip.company)).size;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center">
            <Calendar className="h-8 w-8 text-blue-600 mr-3" />
            <div>
              <p className="text-2xl font-bold text-gray-900">{todayTrips}</p>
              <p className="text-sm text-gray-600">Voyages {t.today}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center">
            <Clock className="h-8 w-8 text-green-600 mr-3" />
            <div>
              <p className="text-2xl font-bold text-gray-900">{thisWeekTrips}</p>
              <p className="text-sm text-gray-600">{t.thisWeekTrips}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center">
            <Building2 className="h-8 w-8 text-purple-600 mr-3" />
            <div>
              <p className="text-2xl font-bold text-gray-900">{totalVisitedCompanies}</p>
              <p className="text-sm text-gray-600">{t.companiesVisited}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TripHistoryStats;
