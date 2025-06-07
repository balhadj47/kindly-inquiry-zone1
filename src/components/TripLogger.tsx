
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapIcon, Clock } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTripContext } from '@/contexts/TripContext';

const TripLogger = () => {
  const [formData, setFormData] = useState({
    vanId: '',
    driverId: '',
    companyId: '',
    branchId: '',
    notes: '',
  });
  const { t } = useLanguage();
  const { addTrip, trips } = useTripContext();

  // Mock data - in a real app, this would come from your backend
  const vans = [
    { id: '1', plateNumber: 'VAN-001', carNumberPlate: 'ABC-123' },
    { id: '2', plateNumber: 'VAN-002', carNumberPlate: 'XYZ-456' },
    { id: '3', plateNumber: 'VAN-003', carNumberPlate: 'DEF-789' },
    { id: '4', plateNumber: 'VAN-004', carNumberPlate: 'GHI-012' },
  ];

  const drivers = [
    { id: '1', name: 'John Smith', licenseNumber: 'DL123456789' },
    { id: '2', name: 'Sarah Johnson', licenseNumber: 'DL987654321' },
    { id: '3', name: 'Mike Wilson', licenseNumber: 'DL456789123' },
    { id: '4', name: 'Lisa Chen', licenseNumber: 'DL789123456' },
  ];

  const companies = [
    { id: '1', name: 'ABC Corporation' },
    { id: '2', name: 'XYZ Logistics Ltd' },
    { id: '3', name: 'DEF Industries Inc' },
  ];

  const branches = {
    '1': ['Downtown', 'Industrial Park', 'North Side'],
    '2': ['South Branch', 'East Terminal'],
    '3': ['West Warehouse', 'Central Hub', 'Port Office', 'Airport Branch'],
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.vanId || !formData.driverId || !formData.companyId || !formData.branchId) {
      toast({
        title: t.error,
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    const selectedVan = vans.find(v => v.id === formData.vanId);
    const selectedDriver = drivers.find(d => d.id === formData.driverId);
    const selectedCompany = companies.find(c => c.id === formData.companyId);
    const selectedBranch = branches[formData.companyId]?.[parseInt(formData.branchId)];

    // Add the trip to the context
    addTrip({
      van: selectedVan?.plateNumber || '',
      driver: selectedDriver?.name || '',
      company: selectedCompany?.name || '',
      branch: selectedBranch || '',
      notes: formData.notes,
    });

    console.log('Trip saved:', {
      van: selectedVan,
      driver: selectedDriver,
      company: selectedCompany,
      branch: selectedBranch,
      timestamp: new Date(),
      notes: formData.notes,
    });

    toast({
      title: "Trip Logged Successfully!",
      description: `${selectedVan?.plateNumber} with driver ${selectedDriver?.name} visit to ${selectedBranch} (${selectedCompany?.name}) has been recorded.`,
    });

    // Reset form
    setFormData({
      vanId: '',
      driverId: '',
      companyId: '',
      branchId: '',
      notes: '',
    });
  };

  const handleInputChange = (field, value) => {
    if (field === 'companyId') {
      // Reset branch when company changes
      setFormData(prev => ({ ...prev, [field]: value, branchId: '' }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  const currentTime = new Date().toLocaleString();

  // Calculate today's trips
  const today = new Date().toISOString().split('T')[0];
  const todaysTrips = trips.filter(trip => trip.timestamp.startsWith(today));

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900">{t.tripLogger}</h1>
        <p className="text-gray-500 mt-2">{t.recordVanVisits}</p>
      </div>

      {/* Current Time Display */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="flex items-center justify-center space-x-2 text-blue-800">
            <Clock className="h-5 w-5" />
            <span className="font-medium">{t.currentTime}: {currentTime}</span>
          </div>
        </CardContent>
      </Card>

      {/* Trip Logging Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MapIcon className="h-5 w-5" />
            <span>{t.logNewTrip}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="van">{t.selectVan}</Label>
              <Select value={formData.vanId} onValueChange={(value) => handleInputChange('vanId', value)}>
                <SelectTrigger>
                  <SelectValue placeholder={t.chooseVan} />
                </SelectTrigger>
                <SelectContent>
                  {vans.map((van) => (
                    <SelectItem key={van.id} value={van.id}>
                      {van.plateNumber} - {van.carNumberPlate}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="driver">Select Driver</Label>
              <Select value={formData.driverId} onValueChange={(value) => handleInputChange('driverId', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a driver" />
                </SelectTrigger>
                <SelectContent>
                  {drivers.map((driver) => (
                    <SelectItem key={driver.id} value={driver.id}>
                      {driver.name} - {driver.licenseNumber}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="company">{t.selectCompany}</Label>
              <Select value={formData.companyId} onValueChange={(value) => handleInputChange('companyId', value)}>
                <SelectTrigger>
                  <SelectValue placeholder={t.chooseCompany} />
                </SelectTrigger>
                <SelectContent>
                  {companies.map((company) => (
                    <SelectItem key={company.id} value={company.id}>
                      {company.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="branch">{t.selectBranch}</Label>
              <Select 
                value={formData.branchId} 
                onValueChange={(value) => handleInputChange('branchId', value)}
                disabled={!formData.companyId}
              >
                <SelectTrigger>
                  <SelectValue placeholder={formData.companyId ? t.chooseBranch : t.selectCompanyFirst} />
                </SelectTrigger>
                <SelectContent>
                  {formData.companyId && branches[formData.companyId]?.map((branch, index) => (
                    <SelectItem key={index} value={index.toString()}>
                      {branch}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">{t.notes}</Label>
              <Input
                id="notes"
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                placeholder={t.notesPlaceholder}
              />
            </div>

            <Button type="submit" className="w-full text-lg py-6">
              {t.logTripVisit}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Quick Stats */}
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
    </div>
  );
};

export default TripLogger;
