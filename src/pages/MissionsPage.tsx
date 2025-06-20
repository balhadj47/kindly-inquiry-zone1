
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Truck } from 'lucide-react';
import { useTrip } from '@/contexts/TripContext';
import { useVans } from '@/hooks/useVans';
import { useRBAC } from '@/contexts/RBACContext';
import { Calendar, Clock, Building2 } from 'lucide-react';
import MissionStats from '@/components/missions/MissionStats';
import MissionList from '@/components/missions/MissionList';
import NewTripDialog from '@/components/NewTripDialog';

const MissionsPage = () => {
  console.log('🚗 MissionsPage: Component rendering...');
  console.log('🚗 MissionsPage: Current URL:', window.location.pathname);
  
  const [isNewMissionDialogOpen, setIsNewMissionDialogOpen] = useState(false);
  const { trips, isLoading, error } = useTrip();
  const { vans } = useVans();
  const { hasPermission, currentUser, loading: rbacLoading } = useRBAC();

  console.log('🚗 MissionsPage: Dialog state:', isNewMissionDialogOpen);
  console.log('🚗 MissionsPage: Trips data:', trips);
  console.log('🚗 MissionsPage: Loading state:', isLoading);
  console.log('🚗 MissionsPage: Error state:', error);
  console.log('🚗 MissionsPage: RBAC loading:', rbacLoading);
  console.log('🚗 MissionsPage: Current user:', currentUser);
  console.log('🚗 MissionsPage: Has missions:create permission:', hasPermission('missions:create'));

  // Calculate real stats from database
  const today = new Date();
  const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const todayMissions = trips.filter(trip => {
    const tripDate = new Date(trip.timestamp);
    return tripDate >= startOfToday;
  }).length;

  const thisWeekMissions = trips.filter(trip => {
    const tripDate = new Date(trip.timestamp);
    return tripDate >= startOfWeek;
  }).length;

  const totalVisitedCompanies = new Set(trips.map(trip => trip.company)).size;

  console.log('🚗 MissionsPage: Stats calculated:', {
    todayMissions,
    thisWeekMissions,
    totalVisitedCompanies,
    totalTrips: trips.length,
  });

  const getVanDisplayName = (vanId: string) => {
    const van = vans.find(v => v.id === vanId);
    if (van) {
      return (van as any).reference_code || van.license_plate || van.model;
    }
    return vanId;
  };

  const quickStats = [
    {
      title: 'Missions Aujourd\'hui',
      value: todayMissions,
      icon: Calendar,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Cette Semaine',
      value: thisWeekMissions,
      icon: Clock,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Entreprises Visitées',
      value: totalVisitedCompanies,
      icon: Building2,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
  ];

  const handleNewMissionClick = () => {
    console.log('🚗 MissionsPage: New Mission button clicked!');
    console.log('🚗 MissionsPage: Current URL before dialog:', window.location.pathname);
    console.log('🚗 MissionsPage: Current dialog state before change:', isNewMissionDialogOpen);
    console.log('🚗 MissionsPage: Has create permission:', hasPermission('missions:create'));
    
    setIsNewMissionDialogOpen(true);
    
    console.log('🚗 MissionsPage: Dialog state should now be true');
  };

  const handleCloseDialog = () => {
    console.log('🚗 MissionsPage: Closing new mission dialog...');
    console.log('🚗 MissionsPage: Current URL after close:', window.location.pathname);
    setIsNewMissionDialogOpen(false);
  };

  // Add permission check for the button
  const canCreateMissions = hasPermission('missions:create');
  console.log('🚗 MissionsPage: Can create missions:', canCreateMissions);

  if (isLoading) {
    console.log('🚗 MissionsPage: Rendering loading state');
    return (
      <div className="space-y-6">
        <div className="bg-white border rounded-lg p-6 mb-6 shadow-sm">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    console.log('🚗 MissionsPage: Rendering error state:', error);
    return (
      <div className="space-y-6">
        <div className="bg-white border rounded-lg p-6 mb-6 shadow-sm">
          <div className="text-center py-12">
            <h3 className="text-lg font-semibold text-red-600 mb-2">Erreur</h3>
            <p className="text-gray-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  console.log('🚗 MissionsPage: Rendering main content with', trips.length, 'trips');
  console.log('🚗 MissionsPage: About to render JSX content');

  return (
    <div className="space-y-6">
      {/* Header Section with integrated Mission Stats */}
      <div className="bg-white border rounded-lg p-6 mb-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gray-100 rounded-lg">
              <Truck className="w-8 h-8 text-gray-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold mb-1 text-gray-900">Gestion des Missions</h1>
              <p className="text-gray-600">Gérez vos missions et suivez vos activités en temps réel</p>
            </div>
          </div>
          
          <Button
            onClick={handleNewMissionClick}
            size="lg"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3"
            disabled={!canCreateMissions}
          >
            <Plus className="w-5 h-5 mr-2" />
            Nouvelle Mission
          </Button>
        </div>

        {/* Quick Stats Cards */}
        <MissionStats quickStats={quickStats} />
      </div>

      {/* Mission List */}
      <MissionList 
        trips={trips}
        getVanDisplayName={getVanDisplayName}
        onNewMissionClick={handleNewMissionClick}
      />

      {/* New Mission Dialog */}
      {console.log('🚗 MissionsPage: Rendering NewTripDialog with isOpen:', isNewMissionDialogOpen)}
      <NewTripDialog
        isOpen={isNewMissionDialogOpen}
        onClose={handleCloseDialog}
      />
    </div>
  );
};

export default MissionsPage;
