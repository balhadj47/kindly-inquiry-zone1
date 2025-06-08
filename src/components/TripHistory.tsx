import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, Calendar, Clock, MapIcon, Eye } from 'lucide-react';
import { useTripContext } from '@/contexts/TripContext';
import { useLanguage } from '@/contexts/LanguageContext';
import TripDetailsDialog from './TripDetailsDialog';
import type { Trip } from '@/contexts/TripContext';
import { formatDateTime, getTimeAgo } from '@/utils/dateUtils';

const TripHistory = () => {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [dateRange, setDateRange] = useState('today');
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { trips, loading, error } = useTripContext();

  const filteredTrips = trips.filter(trip => {
    const matchesSearch = 
      trip.van.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trip.driver.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trip.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trip.branch.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter = filterType === 'all' || 
      (filterType === 'van' && trip.van.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (filterType === 'company' && trip.company.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (filterType === 'branch' && trip.branch.toLowerCase().includes(searchTerm.toLowerCase()));

    return matchesSearch;
  });

  const handleViewDetails = (trip: Trip) => {
    setSelectedTrip(trip);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedTrip(null);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">{t.tripHistory}</h1>
          <p className="text-gray-500 mt-2">{t.loading}...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">{t.tripHistory}</h1>
          <p className="text-red-500 mt-2">{t.error}: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <h1 className="text-3xl font-bold text-gray-900">{t.tripHistory}</h1>
        <div className="flex space-x-2 mt-4 md:mt-0">
          <Button variant="outline">
            <Calendar className="h-4 w-4 mr-2" />
            {t.export}
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder={t.searchTrips}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger>
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder={t.filterBy} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t.allTrips}</SelectItem>
                <SelectItem value="van">{t.byVan}</SelectItem>
                <SelectItem value="company">{t.byCompany}</SelectItem>
                <SelectItem value="branch">{t.byBranch}</SelectItem>
              </SelectContent>
            </Select>

            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger>
                <Calendar className="h-4 w-4 mr-2" />
                <SelectValue placeholder={t.dateRange} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">{t.today}</SelectItem>
                <SelectItem value="week">{t.thisWeek}</SelectItem>
                <SelectItem value="month">{t.thisMonth}</SelectItem>
                <SelectItem value="all">{t.allTime}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Trip Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="text-2xl font-bold text-blue-600">{filteredTrips.length}</div>
            <div className="text-sm text-gray-600">{t.totalTripsCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="text-2xl font-bold text-green-600">
              {new Set(filteredTrips.map(t => t.van)).size}
            </div>
            <div className="text-sm text-gray-600">{t.uniqueVans}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="text-2xl font-bold text-purple-600">
              {new Set(filteredTrips.map(t => t.company)).size}
            </div>
            <div className="text-sm text-gray-600">{t.companiesCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="text-2xl font-bold text-orange-600">
              {new Set(filteredTrips.map(t => t.branch)).size}
            </div>
            <div className="text-sm text-gray-600">{t.branchesCount}</div>
          </CardContent>
        </Card>
      </div>

      {/* Trip List */}
      <Card>
        <CardHeader>
          <CardTitle>{t.recentTrips}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredTrips.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                {t.noTripsFoundMessage}
              </div>
            ) : (
              filteredTrips.map((trip) => (
                <div key={trip.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4 mb-2">
                        <Badge variant="outline" className="font-mono">
                          {trip.van}
                        </Badge>
                        <span className="font-medium text-gray-900">{trip.driver}</span>
                        <div className="flex items-center space-x-1 text-gray-500">
                          <Clock className="h-3 w-3" />
                          <span className="text-xs">{getTimeAgo(trip.timestamp)}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <MapIcon className="h-4 w-4" />
                        <span><strong>{trip.branch}</strong> ({trip.company})</span>
                      </div>
                      
                      {trip.notes && (
                        <div className="mt-2 text-sm text-gray-500">
                          <span className="font-medium">{t.notes}:</span> {trip.notes}
                        </div>
                      )}
                    </div>
                    
                    <div className="mt-2 md:mt-0 md:text-right flex items-center space-x-4">
                      <div className="text-sm font-medium text-gray-900">
                        {formatDateTime(trip.timestamp)}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewDetails(trip)}
                        className="flex items-center space-x-1"
                      >
                        <Eye className="h-4 w-4" />
                        <span>{t.viewDetails}</span>
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      <TripDetailsDialog
        trip={selectedTrip}
        isOpen={dialogOpen}
        onClose={handleCloseDialog}
      />
    </div>
  );
};

export default TripHistory;
