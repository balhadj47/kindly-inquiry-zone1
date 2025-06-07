import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { MapIcon, Clock, Users, Search } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTripContext } from '@/contexts/TripContext';
import { useRBAC } from '@/contexts/RBACContext';

const TripLogger = () => {
  const [formData, setFormData] = useState({
    vanId: '',
    selectedUserIds: [] as string[],
    companyId: '',
    branchId: '',
    notes: '',
  });
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const { t } = useLanguage();
  const { addTrip, trips } = useTripContext();
  const { users, groups } = useRBAC();

  // Mock data - in a real app, this would come from your backend
  const vans = [
    { id: '1', plateNumber: 'VAN-001', carNumberPlate: 'ABC-123' },
    { id: '2', plateNumber: 'VAN-002', carNumberPlate: 'XYZ-456' },
    { id: '3', plateNumber: 'VAN-003', carNumberPlate: 'DEF-789' },
    { id: '4', plateNumber: 'VAN-004', carNumberPlate: 'GHI-012' },
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

  // Group users by their group ID and filter by search query
  const groupedUsers = useMemo(() => {
    const filtered = userSearchQuery.trim() 
      ? users.filter(user => 
          user.name.toLowerCase().includes(userSearchQuery.toLowerCase())
        )
      : users;

    const grouped = filtered.reduce((acc, user) => {
      const groupId = user.groupId;
      if (!acc[groupId]) {
        acc[groupId] = [];
      }
      acc[groupId].push(user);
      return acc;
    }, {} as Record<string, typeof users>);

    return grouped;
  }, [users, userSearchQuery]);

  // Sort groups with admin and employee groups at the end
  const sortedGroupEntries = useMemo(() => {
    const entries = Object.entries(groupedUsers);
    const adminAndEmployeeGroups = ['admin', 'employee'];
    
    const regularGroups = entries.filter(([groupId]) => !adminAndEmployeeGroups.includes(groupId));
    const adminEmployeeGroups = entries.filter(([groupId]) => adminAndEmployeeGroups.includes(groupId));
    
    return [...regularGroups, ...adminEmployeeGroups];
  }, [groupedUsers]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.vanId || formData.selectedUserIds.length === 0 || !formData.companyId || !formData.branchId) {
      toast({
        title: t.error,
        description: "Please fill in all required fields and select at least one user.",
        variant: "destructive",
      });
      return;
    }

    const selectedVan = vans.find(v => v.id === formData.vanId);
    const selectedUsers = users.filter(u => formData.selectedUserIds.includes(u.id.toString()));
    const selectedCompany = companies.find(c => c.id === formData.companyId);
    const selectedBranch = branches[formData.companyId]?.[parseInt(formData.branchId)];

    // For backward compatibility, use the first selected user as the driver
    const primaryUser = selectedUsers[0];

    // Add the trip to the context
    addTrip({
      van: selectedVan?.plateNumber || '',
      driver: primaryUser?.name || '',
      company: selectedCompany?.name || '',
      branch: selectedBranch || '',
      notes: formData.notes,
    });

    console.log('Trip saved:', {
      van: selectedVan,
      users: selectedUsers,
      company: selectedCompany,
      branch: selectedBranch,
      timestamp: new Date(),
      notes: formData.notes,
    });

    const userNames = selectedUsers.map(u => u.name).join(', ');
    toast({
      title: "Trip Logged Successfully!",
      description: `${selectedVan?.plateNumber} with users ${userNames} visit to ${selectedBranch} (${selectedCompany?.name}) has been recorded.`,
    });

    // Reset form
    setFormData({
      vanId: '',
      selectedUserIds: [],
      companyId: '',
      branchId: '',
      notes: '',
    });
    setUserSearchQuery('');
  };

  const handleInputChange = (field, value) => {
    if (field === 'companyId') {
      // Reset branch when company changes
      setFormData(prev => ({ ...prev, [field]: value, branchId: '' }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleUserSelection = (userId, checked) => {
    setFormData(prev => ({
      ...prev,
      selectedUserIds: checked 
        ? [...prev.selectedUserIds, userId]
        : prev.selectedUserIds.filter(id => id !== userId)
    }));
  };

  const currentTime = new Date().toLocaleString();

  // Calculate today's trips
  const today = new Date().toISOString().split('T')[0];
  const todaysTrips = trips.filter(trip => trip.timestamp.startsWith(today));

  // Get total filtered users count
  const totalFilteredUsers = Object.values(groupedUsers).flat().length;

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

            <div className="space-y-4">
              <Label className="flex items-center space-x-2">
                <Users className="h-4 w-4" />
                <span>Select Users ({formData.selectedUserIds.length} selected)</span>
              </Label>
              
              {/* User Search Input */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search users by name..."
                  value={userSearchQuery}
                  onChange={(e) => setUserSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Users grouped by their groups */}
              <div className="max-h-96 overflow-y-auto border rounded-md">
                {sortedGroupEntries.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-8">
                    {userSearchQuery ? 'No users found matching your search.' : 'No users available.'}
                  </p>
                ) : (
                  sortedGroupEntries.map(([groupId, groupUsers]) => {
                    const group = groups.find(g => g.id === groupId);
                    if (!group || groupUsers.length === 0) return null;

                    return (
                      <div key={groupId} className="border-b last:border-b-0">
                        <div className={`px-4 py-3 ${group.color} font-medium text-sm border-b`}>
                          {group.name} ({groupUsers.length} users)
                        </div>
                        <div className="p-3 space-y-3">
                          {groupUsers.map((user) => (
                            <div key={user.id} className="flex items-center space-x-3">
                              <Checkbox
                                id={`user-${user.id}`}
                                checked={formData.selectedUserIds.includes(user.id.toString())}
                                onCheckedChange={(checked) => handleUserSelection(user.id.toString(), checked)}
                              />
                              <label htmlFor={`user-${user.id}`} className="flex-1 cursor-pointer">
                                <div className="flex justify-between items-center">
                                  <div>
                                    <span className="font-medium">{user.name}</span>
                                    <span className="text-sm text-gray-500 ml-2">({user.role})</span>
                                    <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                                      user.status === 'Active' ? 'bg-green-100 text-green-800' :
                                      user.status === 'Récupération' ? 'bg-yellow-100 text-yellow-800' :
                                      user.status === 'Congé' ? 'bg-blue-100 text-blue-800' :
                                      'bg-red-100 text-red-800'
                                    }`}>
                                      {user.status}
                                    </span>
                                  </div>
                                  {user.licenseNumber && (
                                    <span className="text-xs text-gray-400">{user.licenseNumber}</span>
                                  )}
                                </div>
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
              
              {userSearchQuery && (
                <p className="text-xs text-gray-500">
                  Showing {totalFilteredUsers} of {users.length} users
                </p>
              )}
              
              {formData.selectedUserIds.length === 0 && (
                <p className="text-sm text-gray-500">Please select at least one user for the trip.</p>
              )}
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
