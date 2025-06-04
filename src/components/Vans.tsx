
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, User } from 'lucide-react';
import VanModal from './VanModal';

const Vans = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVan, setSelectedVan] = useState(null);

  // Mock data - in a real app, this would come from your backend
  const vans = [
    {
      id: 1,
      plateNumber: 'VAN-001',
      model: 'Ford Transit',
      driver: 'John Smith',
      status: 'Active',
      totalTrips: 45,
      lastTrip: '2 hours ago',
      currentLocation: 'Downtown Branch',
    },
    {
      id: 2,
      plateNumber: 'VAN-002',
      model: 'Mercedes Sprinter',
      driver: 'Sarah Johnson',
      status: 'In Transit',
      totalTrips: 38,
      lastTrip: '30 mins ago',
      currentLocation: 'En route to Industrial Park',
    },
    {
      id: 3,
      plateNumber: 'VAN-003',
      model: 'Iveco Daily',
      driver: 'Mike Wilson',
      status: 'Maintenance',
      totalTrips: 52,
      lastTrip: '1 day ago',
      currentLocation: 'Service Center',
    },
    {
      id: 4,
      plateNumber: 'VAN-004',
      model: 'Ford Transit',
      driver: 'Lisa Chen',
      status: 'Active',
      totalTrips: 29,
      lastTrip: '1 hour ago',
      currentLocation: 'North Branch',
    },
  ];

  const filteredVans = vans.filter(van =>
    van.plateNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    van.driver.toLowerCase().includes(searchTerm.toLowerCase()) ||
    van.model.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'In Transit': return 'bg-blue-100 text-blue-800';
      case 'Maintenance': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleAddVan = () => {
    setSelectedVan(null);
    setIsModalOpen(true);
  };

  const handleEditVan = (van) => {
    setSelectedVan(van);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Vans & Drivers</h1>
        <Button onClick={handleAddVan} className="mt-4 md:mt-0">
          Add New Van
        </Button>
      </div>

      {/* Search Bar */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by plate number, driver, or model..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Vans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVans.map((van) => (
          <Card key={van.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{van.plateNumber}</CardTitle>
                  <p className="text-sm text-gray-600">{van.model}</p>
                </div>
                <Badge className={getStatusColor(van.status)}>
                  {van.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium">{van.driver}</span>
              </div>
              
              <div className="text-sm text-gray-600">
                <p><span className="font-medium">Location:</span> {van.currentLocation}</p>
                <p><span className="font-medium">Total Trips:</span> {van.totalTrips}</p>
                <p><span className="font-medium">Last Trip:</span> {van.lastTrip}</p>
              </div>
              
              <div className="flex space-x-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEditVan(van)}
                  className="flex-1"
                >
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                >
                  View Trips
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <VanModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        van={selectedVan}
      />
    </div>
  );
};

export default Vans;
