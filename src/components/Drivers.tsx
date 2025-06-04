
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, User, Phone, Mail } from 'lucide-react';
import DriverModal from './DriverModal';

const Drivers = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState(null);

  // Mock data - in a real app, this would come from your backend
  const drivers = [
    {
      id: 1,
      name: 'John Smith',
      licenseNumber: 'DL123456789',
      phone: '+1 (555) 123-4567',
      email: 'john.smith@company.com',
      status: 'Available',
      totalTrips: 45,
      lastTrip: '2 hours ago',
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      licenseNumber: 'DL987654321',
      phone: '+1 (555) 987-6543',
      email: 'sarah.johnson@company.com',
      status: 'On Trip',
      totalTrips: 38,
      lastTrip: '30 mins ago',
    },
    {
      id: 3,
      name: 'Mike Wilson',
      licenseNumber: 'DL456789123',
      phone: '+1 (555) 456-7890',
      email: 'mike.wilson@company.com',
      status: 'Unavailable',
      totalTrips: 52,
      lastTrip: '1 day ago',
    },
    {
      id: 4,
      name: 'Lisa Chen',
      licenseNumber: 'DL789123456',
      phone: '+1 (555) 789-1234',
      email: 'lisa.chen@company.com',
      status: 'Available',
      totalTrips: 29,
      lastTrip: '1 hour ago',
    },
  ];

  const filteredDrivers = drivers.filter(driver =>
    driver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    driver.licenseNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    driver.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'Available': return 'bg-green-100 text-green-800';
      case 'On Trip': return 'bg-blue-100 text-blue-800';
      case 'Unavailable': return 'bg-red-100 text-red-800';
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
        <h1 className="text-3xl font-bold text-gray-900">Drivers Management</h1>
        <Button onClick={handleAddDriver} className="mt-4 md:mt-0">
          Add New Driver
        </Button>
      </div>

      {/* Search Bar */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by name, license number, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Drivers Grid */}
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
                <p><span className="font-medium">Total Trips:</span> {driver.totalTrips}</p>
                <p><span className="font-medium">Last Trip:</span> {driver.lastTrip}</p>
              </div>
              
              <div className="flex space-x-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEditDriver(driver)}
                  className="flex-1"
                >
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                >
                  View History
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <DriverModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        driver={selectedDriver}
      />
    </div>
  );
};

export default Drivers;
