import React, { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Search, User, Phone, Mail, Plus } from 'lucide-react';
import DriverModal from './DriverModal';
import { useRBAC } from '@/contexts/RBACContext';
import { getRoleNameFromId, isDriverRole } from '@/utils/roleUtils';
import { RefreshButton } from '@/components/ui/refresh-button';

const DriversLoadingSkeleton = () => {
  return (
    <div className="space-y-6">
      {/* Header skeleton */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <Skeleton className="h-9 w-64 mb-4 md:mb-0" />
        <Skeleton className="h-10 w-64" />
      </div>

      {/* Search Bar skeleton */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Skeleton className="h-10 w-full" />
          </div>
        </CardContent>
      </Card>

      {/* Drivers Grid skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <Card key={index} className="animate-pulse">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <Skeleton className="h-6 w-32 mb-1" />
                  <Skeleton className="h-4 w-24" />
                </div>
                <Skeleton className="h-6 w-16" />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Skeleton className="h-4 w-4" />
                  <Skeleton className="h-4 w-24" />
                </div>
                <div className="flex items-center space-x-2">
                  <Skeleton className="h-4 w-4" />
                  <Skeleton className="h-4 w-32" />
                </div>
              </div>
              
              <div className="space-y-1">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
              
              <div className="flex space-x-2 pt-2">
                <Skeleton className="h-8 flex-1" />
                <Skeleton className="h-8 flex-1" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

const Drivers = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const { users, loading } = useRBAC();

  // Refresh data when component mounts (user enters the page)
  useEffect(() => {
    console.log('🚗 Drivers component mounted, refreshing data');
    // Note: useRBAC doesn't have a refetch method, data is managed internally
  }, []);

  const handleRefresh = () => {
    // Force a page refresh to get fresh data since useRBAC doesn't expose refetch
    window.location.reload();
  };

  if (loading) {
    return <DriversLoadingSkeleton />;
  }

  // Filter users who are drivers (have driver-related roles and license numbers)
  const drivers = useMemo(() => {
    return users.filter(user => 
      user.licenseNumber && 
      isDriverRole(user.role_id)
    );
  }, [users]);

  const filteredDrivers = drivers.filter(driver =>
    driver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (driver.licenseNumber && driver.licenseNumber.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (driver.email && driver.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': 
      case 'Actif': return 'bg-green-100 text-green-800';
      case 'Congé': return 'bg-blue-100 text-blue-800';
      case 'Congé maladie': return 'bg-red-100 text-red-800';
      case 'Récupération': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleAddDriver = () => {
    setSelectedDriver(null);
    setIsModalOpen(true);
  };

  const handleEditDriver = (driver) => {
    setSelectedDriver(driver);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Gestion des Chauffeurs</h1>
        <div className="flex items-center gap-2 mt-4 md:mt-0">
          <RefreshButton onRefresh={handleRefresh} />
          <Button onClick={handleAddDriver}>
            <Plus className="h-4 w-4 mr-2" />
            Ajouter Nouveau Chauffeur
          </Button>
        </div>
      </div>

      {/* Search Bar */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Rechercher par nom, numéro de permis, ou email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Empty State */}
      {filteredDrivers.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun chauffeur trouvé</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm 
                ? "Essayez d'ajuster votre recherche" 
                : "Commencez par ajouter votre premier chauffeur"
              }
            </p>
            {!searchTerm && (
              <Button onClick={handleAddDriver}>
                <Plus className="h-4 w-4 mr-2" />
                Ajouter Votre Premier Chauffeur
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Drivers Grid */}
      {filteredDrivers.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDrivers.map((driver) => (
            <Card key={driver.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{driver.name}</CardTitle>
                    <p className="text-sm text-gray-600">{driver.licenseNumber}</p>
                  </div>
                  <Badge className={getStatusColor(driver.status)}>
                    {driver.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">{driver.phone}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">{driver.email}</span>
                  </div>
                </div>
                
                <div className="text-sm text-gray-600">
                  <p><span className="font-medium">Role:</span> {getRoleNameFromId(driver.role_id)}</p>
                  <p><span className="font-medium">Voyages Totaux:</span> {driver.totalTrips || 0}</p>
                  <p><span className="font-medium">Dernier Voyage:</span> {driver.lastTrip || 'Jamais'}</p>
                </div>
                
                <div className="flex space-x-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditDriver(driver)}
                    className="flex-1"
                  >
                    Modifier
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                  >
                    Voir Historique
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <DriverModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        driver={selectedDriver}
      />
    </div>
  );
};

export default Drivers;
