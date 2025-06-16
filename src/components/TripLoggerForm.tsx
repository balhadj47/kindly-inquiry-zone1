
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
  const { addTrip, trips } = useTripContext();
  const { users } = useRBAC();
  const { companies } = useCompanies();
  const { vans } = useVans();
  const { formData, handleInputChange, handleUserRoleSelection, resetForm, getTripData } = useTripForm();
  const [userSearchQuery, setUserSearchQuery] = useState('');

  // Filter out vans that are currently in active trips
  const activeTrips = trips.filter(trip => trip.status === 'active');
  const activeVanIds = activeTrips.map(trip => trip.van);
  const availableVans = vans.filter(van => !activeVanIds.includes(van.license_plate));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.vanId || !formData.companyId || !formData.branchId || !formData.startKm) {
      toast({
        title: t.error,
        description: "Please fill in all required fields including starting kilometers",
        variant: "destructive",
      });
      return;
    }

    // Validate start kilometers is a positive number
    const startKmValue = parseInt(formData.startKm);
    if (isNaN(startKmValue) || startKmValue < 0) {
      toast({
        title: t.error,
        description: "Please enter a valid starting kilometer value",
        variant: "destructive",
      });
      return;
    }

    // Check if at least one user with roles is selected
    if (formData.selectedUsersWithRoles.length === 0) {
      toast({
        title: t.error,
        description: "Please select at least one user with roles for the trip",
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

    // Find a driver from the selected users with roles (someone with "Chauffeur" role)
    const driverUserWithRole = formData.selectedUsersWithRoles.find(userWithRole =>
      userWithRole.roles.includes('Chauffeur')
    );

    let driverName = 'No Driver Assigned';
    if (driverUserWithRole) {
      const driverUser = users.find(user => user.id.toString() === driverUserWithRole.userId);
      if (driverUser) {
        driverName = driverUser.name;
      }
    }

    const tripData = {
      van: selectedVan.license_plate,
      driver: driverName,
      company: selectedCompany.name,
      branch: selectedBranch.name,
      notes: formData.notes,
      userIds: formData.selectedUsersWithRoles.map(u => u.userId),
      userRoles: formData.selectedUsersWithRoles,
      startKm: startKmValue, // Include start kilometers
    };

    console.log('Submitting trip data:', tripData);
    console.log('User roles for this mission:', tripData.userRoles);

    addTrip(tripData);
    resetForm();
    setUserSearchQuery('');
    
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
          <div>
            <Label htmlFor="van">{t.selectVan}</Label>
            <Select value={formData.vanId} onValueChange={(value) => handleInputChange('vanId', value)}>
              <SelectTrigger>
                <SelectValue placeholder={t.selectVan} />
              </SelectTrigger>
              <SelectContent>
                {availableVans.map((van) => (
                  <SelectItem key={van.id} value={van.id}>
                    {van.license_plate} - {van.model}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {availableVans.length < vans.length && (
              <p className="text-sm text-muted-foreground mt-1">
                {vans.length - availableVans.length} van(s) currently in mission
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="startKm">Starting Kilometers *</Label>
            <Input
              id="startKm"
              type="number"
              placeholder="Enter starting kilometer reading"
              value={formData.startKm}
              onChange={(e) => handleInputChange('startKm', e.target.value)}
              min="0"
              required
            />
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
