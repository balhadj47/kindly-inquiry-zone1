
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
import VanModal from './VanModal';

const Vans = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVan, setSelectedVan] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortField, setSortField] = useState('plateNumber');
  const [sortDirection, setSortDirection] = useState('asc');
  const [viewMode, setViewMode] = useState('grid');
  const { toast } = useToast();

  // Enhanced mock data with more properties
  const vans = [
    {
      id: 1,
      plateNumber: 'VAN-001',
      carNumberPlate: 'ABC-123',
      model: 'Ford Transit',
      status: 'Active',
      totalTrips: 45,
      lastTrip: '2 hours ago',
      currentLocation: 'Downtown Branch',
      fuelLevel: 85,
      nextMaintenance: '2024-01-15',
      driver: 'John Smith',
      image: 'https://images.unsplash.com/photo-1605810230434-7631ac76ec81?auto=format&fit=crop&w=400&q=80',
      efficiency: 92,
      mileage: '45,230 km',
      yearlyTrips: 156,
    },
    {
      id: 2,
      plateNumber: 'VAN-002',
      carNumberPlate: 'XYZ-456',
      model: 'Mercedes Sprinter',
      status: 'In Transit',
      totalTrips: 38,
      lastTrip: '30 mins ago',
      currentLocation: 'En route to Industrial Park',
      fuelLevel: 67,
      nextMaintenance: '2024-01-20',
      driver: 'Sarah Johnson',
      image: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=400&q=80',
      efficiency: 88,
      mileage: '38,450 km',
      yearlyTrips: 142,
    },
    {
      id: 3,
      plateNumber: 'VAN-003',
      carNumberPlate: 'DEF-789',
      model: 'Iveco Daily',
      status: 'Maintenance',
      totalTrips: 52,
      lastTrip: '1 day ago',
      currentLocation: 'Service Center',
      fuelLevel: 15,
      nextMaintenance: 'In Progress',
      driver: 'Unassigned',
      image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=400&q=80',
      efficiency: 75,
      mileage: '62,180 km',
      yearlyTrips: 98,
    },
    {
      id: 4,
      plateNumber: 'VAN-004',
      carNumberPlate: 'GHI-012',
      model: 'Ford Transit',
      status: 'Active',
      totalTrips: 29,
      lastTrip: '1 hour ago',
      currentLocation: 'North Branch',
      fuelLevel: 94,
      nextMaintenance: '2024-02-01',
      driver: 'Mike Wilson',
      image: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=400&q=80',
      efficiency: 95,
      mileage: '28,950 km',
      yearlyTrips: 189,
    },
  ];

  const filteredAndSortedVans = useMemo(() => {
    let filtered = vans.filter(van => {
      const matchesSearch = 
        van.plateNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        van.carNumberPlate.toLowerCase().includes(searchTerm.toLowerCase()) ||
        van.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
        van.driver.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || van.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });

    // Sort vans
    filtered.sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];
      
      if (sortField === 'totalTrips' || sortField === 'fuelLevel' || sortField === 'efficiency') {
        aValue = Number(aValue);
        bValue = Number(bValue);
      }
      
      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [vans, searchTerm, statusFilter, sortField, sortDirection]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'In Transit': return 'bg-blue-100 text-blue-800';
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
      title: "Action Performed",
      description: `${action} action performed on ${van.plateNumber}`,
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
    { value: 'all', label: 'All Status' },
    { value: 'Active', label: 'Active' },
    { value: 'In Transit', label: 'In Transit' },
    { value: 'Maintenance', label: 'Maintenance' },
  ];

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Vans Management</h1>
          <div className="flex items-center space-x-6 mt-2">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-600">{vans.filter(v => v.status === 'Active').length} Active</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-sm text-gray-600">{vans.filter(v => v.status === 'In Transit').length} In Transit</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="text-sm text-gray-600">{vans.filter(v => v.status === 'Maintenance').length} Maintenance</span>
            </div>
          </div>
        </div>
        <Button onClick={handleAddVan} className="mt-4 lg:mt-0">
          <Plus className="h-4 w-4 mr-2" />
          Add New Van
        </Button>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by plate, model, driver..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by status" />
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
                  <SelectValue placeholder="Sort by..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="plateNumber">Plate Number</SelectItem>
                  <SelectItem value="model">Model</SelectItem>
                  <SelectItem value="totalTrips">Total Trips</SelectItem>
                  <SelectItem value="fuelLevel">Fuel Level</SelectItem>
                  <SelectItem value="efficiency">Efficiency</SelectItem>
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
      {filteredAndSortedVans.length !== vans.length && (
        <div className="text-sm text-gray-600">
          Showing {filteredAndSortedVans.length} of {vans.length} vans
        </div>
      )}

      {/* Empty State */}
      {filteredAndSortedVans.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Car className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No vans found</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || statusFilter !== 'all' 
                ? "Try adjusting your search or filters" 
                : "Get started by adding your first van"
              }
            </p>
            {(!searchTerm && statusFilter === 'all') && (
              <Button onClick={handleAddVan}>
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Van
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
                  alt={`${van.model} - ${van.plateNumber}`}
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
                      Low Fuel
                    </Badge>
                  </div>
                )}
              </div>

              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{van.plateNumber}</CardTitle>
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
                    <span className="text-sm">{van.totalTrips} trips</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                  <div>
                    <span className="font-medium">Driver:</span> {van.driver}
                  </div>
                  <div>
                    <span className="font-medium">Mileage:</span> {van.mileage}
                  </div>
                  <div>
                    <span className="font-medium">Last Trip:</span> {van.lastTrip}
                  </div>
                  <div className="flex items-center">
                    <span className="font-medium">Maintenance:</span>
                    {van.nextMaintenance === 'In Progress' ? (
                      <AlertTriangle className="h-3 w-3 ml-1 text-orange-500" />
                    ) : (
                      <Clock className="h-3 w-3 ml-1 text-gray-400" />
                    )}
                  </div>
                </div>

                {/* Progress Bar for Fuel */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span>Fuel Level</span>
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
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuickAction('View Trips', van)}
                    className="flex-1"
                  >
                    <Eye className="h-3 w-3 mr-1" />
                    Trips
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuickAction('Track', van)}
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
