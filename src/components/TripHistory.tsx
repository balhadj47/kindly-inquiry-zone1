
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, Calendar, Clock, MapIcon } from 'lucide-react';
import { useTripContext } from '@/contexts/TripContext';

const TripHistory = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [dateRange, setDateRange] = useState('today');
  const { trips } = useTripContext();

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

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  const getTimeAgo = (timestamp) => {
    const now = new Date();
    const tripTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - tripTime.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes} mins ago`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)} hours ago`;
    } else {
      return `${Math.floor(diffInMinutes / 1440)} days ago`;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Trip History</h1>
        <div className="flex space-x-2 mt-4 md:mt-0">
          <Button variant="outline">
            <Calendar className="h-4 w-4 mr-2" />
            Export
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
                placeholder="Search trips..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger>
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Trips</SelectItem>
                <SelectItem value="van">By Van</SelectItem>
                <SelectItem value="company">By Company</SelectItem>
                <SelectItem value="branch">By Branch</SelectItem>
              </SelectContent>
            </Select>

            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger>
                <Calendar className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Date range..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="all">All Time</SelectItem>
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
            <div className="text-sm text-gray-600">Total Trips</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="text-2xl font-bold text-green-600">
              {new Set(filteredTrips.map(t => t.van)).size}
            </div>
            <div className="text-sm text-gray-600">Unique Vans</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="text-2xl font-bold text-purple-600">
              {new Set(filteredTrips.map(t => t.company)).size}
            </div>
            <div className="text-sm text-gray-600">Companies</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="text-2xl font-bold text-orange-600">
              {new Set(filteredTrips.map(t => t.branch)).size}
            </div>
            <div className="text-sm text-gray-600">Branches</div>
          </CardContent>
        </Card>
      </div>

      {/* Trip List */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Trips</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredTrips.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No trips found. Try logging a new trip!
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
                          <span className="font-medium">Notes:</span> {trip.notes}
                        </div>
                      )}
                    </div>
                    
                    <div className="mt-2 md:mt-0 md:text-right">
                      <div className="text-sm font-medium text-gray-900">
                        {formatTime(trip.timestamp)}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TripHistory;
