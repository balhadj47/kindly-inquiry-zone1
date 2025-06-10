
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useTripForm } from '@/hooks/useTripForm';
import { useTripContext } from '@/contexts/TripContext';
import { useRBAC } from '@/contexts/RBACContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCompanies } from '@/hooks/useCompanies';
import { useVans } from '@/hooks/useVans';
import RoleSelectionSection from './RoleSelectionSection';

const TripLoggerForm = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const { addTrip } = useTripContext();
  const { users } = useRBAC();
  const { companies } = useCompanies();
  const { vans } = useVans();
  const { formData, handleInputChange, handleUserRoleSelection, resetForm, getTripData } = useTripForm();
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [selectedDriverId, setSelectedDriverId] = useState('');

  // Get drivers from users data (those with driver roles)
  const drivers = users.filter(user => 
    user.role === 'Chauffeur Armé' || user.role === 'Chauffeur Sans Armé'
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.vanId || !formData.companyId || !formData.branchId || !selectedDriverId) {
      toast({
        title: t.error,
        description: t.fillRequiredFields,
        variant: "destructive",
      });
      return;
    }

    // Find the selected van
    const selectedVan = vans.find(van => van.id === formData.vanId);
    
    if (!selectedVan) {
      toast({
        title: t.error,
        description: t.vanNotFound,
        variant: "destructive",
      });
      return;
    }

    // Find the selected driver
    const selectedDriver = drivers.find(driver => driver.id.toString() === selectedDriverId);
    
    if (!selectedDriver) {
      toast({
        title: t.error,
        description: "Driver not found",
        variant: "destructive",
      });
      return;
    }

    // Find the selected company and branch names
    const selectedCompany = companies.find(company => company.id === formData.companyId);
    const selectedBranch = selectedCompany?.branches.find(branch => branch.id === formData.branchId);

    if (!selectedCompany || !selectedBranch) {
      toast({
        title: t.error,
        description: t.companyNotFound,
        variant: "destructive",
      });
      return;
    }

    // Create the driver name with full name and role
    const driverName = `${selectedDriver.name} (${selectedDriver.role})`;

    const tripDataWithRoles = getTripData(driverName);
    
    const tripData = {
      van: selectedVan.license_plate,
      driver: driverName, // Now includes full name and role
      company: selectedCompany.name,
      branch: selectedBranch.name,
      notes: formData.notes,
      userIds: tripDataWithRoles.userIds,
    };

    console.log('Submitting trip data:', tripData);
    console.log('User roles for this mission:', tripDataWithRoles.userRoles);

    addTrip(tripData);
    resetForm();
    setUserSearchQuery('');
    setSelectedDriverId('');
    
    toast({
      title: t.success,
      description: t.tripLoggedSuccessfully,
    });
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{t.logNewTrip}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="van">{t.selectVan}</Label>
              <Select value={formData.vanId} onValueChange={(value) => handleInputChange('vanId', value)}>
                <SelectTrigger>
                  <SelectValue placeholder={t.selectVan} />
                </SelectTrigger>
                <SelectContent>
                  {vans.map((van) => (
                    <SelectItem key={van.id} value={van.id}>
                      {van.license_plate} - {van.model}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="driver">Select Driver *</Label>
              <Select value={selectedDriverId} onValueChange={setSelectedDriverId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Driver" />
                </SelectTrigger>
                <SelectContent>
                  {drivers.map((driver) => (
                    <SelectItem key={driver.id} value={driver.id.toString()}>
                      {driver.name} - {driver.role}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="company">{t.selectCompany}</Label>
              <Select value={formData.companyId} onValueChange={(value) => handleInputChange('companyId', value)}>
                <SelectTrigger>
                  <SelectValue placeholder={t.selectCompany} />
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

            {formData.companyId && (
              <div>
                <Label htmlFor="branch">{t.selectBranch}</Label>
                <Select value={formData.branchId} onValueChange={(value) => handleInputChange('branchId', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder={t.selectBranch} />
                  </SelectTrigger>
                  <SelectContent>
                    {companies
                      .find(c => c.id === formData.companyId)
                      ?.branches.map((branch) => (
                        <SelectItem key={branch.id} value={branch.id}>
                          {branch.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          <RoleSelectionSection
            userSearchQuery={userSearchQuery}
            setUserSearchQuery={setUserSearchQuery}
            selectedUsersWithRoles={formData.selectedUsersWithRoles}
            onUserRoleSelection={handleUserRoleSelection}
          />

          <div>
            <Label htmlFor="notes">{t.notes}</Label>
            <Textarea
              id="notes"
              placeholder={t.addNotesPlaceholder}
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              rows={3}
            />
          </div>

          <Button type="submit" className="w-full">
            {t.logTrip}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default TripLoggerForm;
