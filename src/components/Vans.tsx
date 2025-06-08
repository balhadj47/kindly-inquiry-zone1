
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Search, 
  Car, 
  MapPin, 
  Calendar, 
  Filter,
  SortAsc,
  SortDesc,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Plus,
  Route,
  Fuel,
  Settings,
  TrendingUp,
  Clock,
  AlertTriangle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useVans } from '@/hooks/useVans';
import VanModal from './VanModal';

const Vans = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVan, setSelectedVan] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortField, setSortField] = useState('license_plate');
  const [sortDirection, setSortDirection] = useState('asc');
  const { toast } = useToast();
  const { vans, loading, error } = useVans();

  // Mock data for demonstration while database is being populated
  const mockVans = [
    {
      id: '1',
      license_plate: 'VAN-001',
      model: 'Ford Transit',
      status: 'Actif',
      driver_id: 'driver-1',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      carNumberPlate: 'ABC-123',
      totalTrips: 45,
      lastTrip: 'Il y a 2 heures',
      currentLocation: 'Succursale Centre-ville',
      fuelLevel: 85,
      nextMaintenance: '2024-01-15',
      driver: 'Jean Dupont',
      image: 'https://images.unsplash.com/photo-1605810230434-7631ac76ec81?auto=format&fit=crop&w=400&q=80',
      efficiency: 92,
      mileage: '45 230 km',
      yearlyTrips: 156,
    },
    {
      id: '2',
      license_plate: 'VAN-002',
      model: 'Mercedes Sprinter',
      status: 'En Transit',
      driver_id: 'driver-2',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      carNumberPlate: 'XYZ-456',
      totalTrips: 38,
      lastTrip: 'Il y a 30 min',
      currentLocation: 'En route vers Zone Industrielle',
      fuelLevel: 67,
      nextMaintenance: '2024-01-20',
      driver: 'Marie Martin',
      image: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=400&q=80',
      efficiency: 88,
      mileage: '38 450 km',
      yearlyTrips: 142,
    },
  ];

  // Use database vans if available, otherwise fall back to mock data
  const displayVans = vans.length > 0 ? vans.map(van => ({
    ...van,
    carNumberPlate: van.license_plate,
    totalTrips: 0,
    lastTrip: 'Jamais',
    currentLocation: 'Inconnu',
    fuelLevel: 50,
    nextMaintenance: 'À déterminer',
    driver: 'Non assigné',
    image: 'https://images.unsplash.com/photo-1605810230434-7631ac76ec81?auto=format&fit=crop&w=400&q=80',
    efficiency: 85,
    mileage: '0 km',
    yearlyTrips: 0,
  })) : mockVans;

  const filteredAndSortedVans = useMemo(() => {
    let filtered = displayVans.filter(van => {
      const matchesSearch = 
        van.license_plate.toLowerCase().includes(searchTerm.toLowerCase()) ||
        van.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (van.carNumberPlate && van.carNumberPlate.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (van.driver && van.driver.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesStatus = statusFilter === 'all' || van.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });

    // Sort vans
    filtered.sort((a, b) => {
      let aValue = a[sortField] || '';
      let bValue = b[sortField] || '';
      
      if (sortField === 'totalTrips' || sortField === 'fuelLevel' || sortField === 'efficiency') {
        aValue = Number(aValue) || 0;
        bValue = Number(bValue) || 0;
      }
      
      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [displayVans, searchTerm, statusFilter, sortField, sortDirection]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Actif': return 'bg-green-100 text-green-800';
      case 'En Transit': return 'bg-blue-100 text-blue-800';
      case 'Maintenance': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getFuelLevelColor = (level) => {
    if (level > 50) return 'text-green-600';
    if (level > 25) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getEfficiencyColor = (efficiency) => {
    if (efficiency >= 90) return 'text-green-600';
    if (efficiency >= 80) return 'text-yellow-600';
    return 'text-red-600';
  };

  const handleAddVan = () => {
    setSelectedVan(null);
    setIsModalOpen(true);
  };

  const handleEditVan = (van) => {
    setSelectedVan(van);
    setIsModalOpen(true);
  };

  const handleQuickAction = (action, van) => {
    toast({
      title: "Action Effectuée",
      description: `Action ${action} effectuée sur ${van.license_plate}`,
    });
  };

  const toggleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const statusOptions = [
    { value: 'all', label: 'Tous les Statuts' },
    { value: 'Actif', label: 'Actif' },
    { value: 'En Transit', label: 'En Transit' },
    { value: 'Maintenance', label: 'Maintenance' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Chargement des camionnettes...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-red-600">Erreur: {error}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestion des Camionnettes</h1>
          <div className="flex items-center space-x-6 mt-2">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-600">
                {displayVans.filter(v => v.status === 'Actif').length} Actives
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-sm text-gray-600">
                {displayVans.filter(v => v.status === 'En Transit').length} En Transit
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="text-sm text-gray-600">
                {displayVans.filter(v => v.status === 'Maintenance').length} Maintenance
              </span>
            </div>
          </div>
        </div>
        <Button onClick={handleAddVan} className="mt-4 lg:mt-0">
          <Plus className="h-4 w-4 mr-2" />
          Ajouter Nouvelle Camionnette
        </Button>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Rechercher par plaque, modèle, chauffeur..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filtrer par statut" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={sortField} onValueChange={setSortField}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  {sortDirection === 'asc' ? 
                    <SortAsc className="h-4 w-4 mr-2" /> : 
                    <SortDesc className="h-4 w-4 mr-2" />
                  }
                  <SelectValue placeholder="Trier par..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="license_plate">Plaque d'Immatriculation</SelectItem>
                  <SelectItem value="model">Modèle</SelectItem>
                  <SelectItem value="totalTrips">Voyages Totaux</SelectItem>
                  <SelectItem value="fuelLevel">Niveau de Carburant</SelectItem>
                  <SelectItem value="efficiency">Efficacité</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                onClick={() => toggleSort(sortField)}
                className="px-3"
              >
                {sortDirection === 'asc' ? 
                  <SortAsc className="h-4 w-4" /> : 
                  <SortDesc className="h-4 w-4" />
                }
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Summary */}
      {filteredAndSortedVans.length !== displayVans.length && (
        <div className="text-sm text-gray-600">
          Affichage de {filteredAndSortedVans.length} sur {displayVans.length} camionnettes
        </div>
      )}

      {/* Empty State */}
      {filteredAndSortedVans.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Car className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune camionnette trouvée</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || statusFilter !== 'all' 
                ? "Essayez d'ajuster votre recherche ou vos filtres" 
                : "Commencez par ajouter votre première camionnette"
              }
            </p>
            {(!searchTerm && statusFilter === 'all') && (
              <Button onClick={handleAddVan}>
                <Plus className="h-4 w-4 mr-2" />
                Ajouter Votre Première Camionnette
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Vans Grid */}
      {filteredAndSortedVans.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSortedVans.map((van) => (
            <Card key={van.id} className="hover:shadow-lg transition-all duration-200 hover:scale-[1.02]">
              {/* Van Image */}
              <div className="relative h-48 overflow-hidden rounded-t-lg">
                <img 
                  src={van.image} 
                  alt={`${van.model} - ${van.license_plate}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 right-3">
                  <Badge className={getStatusColor(van.status)}>
                    {van.status}
                  </Badge>
                </div>
                {van.fuelLevel <= 25 && (
                  <div className="absolute top-3 left-3">
                    <Badge variant="destructive" className="text-xs">
                      <Fuel className="h-3 w-3 mr-1" />
                      Carburant Bas
                    </Badge>
                  </div>
                )}
              </div>

              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{van.license_plate}</CardTitle>
                    <p className="text-sm text-gray-600">{van.model}</p>
                  </div>
                  <div className="flex items-center space-x-1">
                    <TrendingUp className={`h-4 w-4 ${getEfficiencyColor(van.efficiency)}`} />
                    <span className={`text-sm font-medium ${getEfficiencyColor(van.efficiency)}`}>
                      {van.efficiency}%
                    </span>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Car className="h-4 w-4 text-gray-500" />
                  <span className="text-sm font-medium">{van.carNumberPlate}</span>
                </div>

                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <span className="text-sm truncate">{van.currentLocation}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Fuel className={`h-4 w-4 ${getFuelLevelColor(van.fuelLevel)}`} />
                    <span className={`text-sm ${getFuelLevelColor(van.fuelLevel)}`}>
                      {van.fuelLevel}%
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Route className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">{van.totalTrips} voyages</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                  <div>
                    <span className="font-medium">Chauffeur:</span> {van.driver}
                  </div>
                  <div>
                    <span className="font-medium">Kilométrage:</span> {van.mileage}
                  </div>
                  <div>
                    <span className="font-medium">Dernier Voyage:</span> {van.lastTrip}
                  </div>
                  <div className="flex items-center">
                    <span className="font-medium">Maintenance:</span>
                    {van.nextMaintenance === 'En Cours' ? (
                      <AlertTriangle className="h-3 w-3 ml-1 text-orange-500" />
                    ) : (
                      <Clock className="h-3 w-3 ml-1 text-gray-400" />
                    )}
                  </div>
                </div>

                {/* Progress Bar for Fuel */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span>Niveau de Carburant</span>
                    <span className={getFuelLevelColor(van.fuelLevel)}>{van.fuelLevel}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all ${
                        van.fuelLevel > 50 ? 'bg-green-500' : 
                        van.fuelLevel > 25 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${van.fuelLevel}%` }}
                    ></div>
                  </div>
                </div>
                
                {/* Quick Action Buttons */}
                <div className="flex space-x-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditVan(van)}
                    className="flex-1"
                  >
                    <Edit className="h-3 w-3 mr-1" />
                    Modifier
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuickAction('Voir Voyages', van)}
                    className="flex-1"
                  >
                    <Eye className="h-3 w-3 mr-1" />
                    Voyages
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuickAction('Suivre', van)}
                    className="px-2"
                  >
                    <MapPin className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <VanModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        van={selectedVan}
      />
    </div>
  );
};

export default Vans;
