
import React from 'react';
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
import UserSelectionSection from './UserSelectionSection';

// Mock data for companies and vans since they don't exist in RBAC context yet
const MOCK_COMPANIES = [
  {
    id: 'company-1',
    name: 'SecuriTransport SA',
    branches: [
      { id: 'branch-1', name: 'Alger Centre' },
      { id: 'branch-2', name: 'Oran Port' },
    ]
  },
  {
    id: 'company-2',
    name: 'GuardShield Corp',
    branches: [
      { id: 'branch-3', name: 'Constantine North' },
      { id: 'branch-4', name: 'Annaba Industrial' },
    ]
  }
];

const MOCK_VANS = [
  {
    id: 'van-1',
    licensePlate: '16-12345-01',
    model: 'Mercedes Sprinter',
    driverId: '10' // Omar Said Meziane
  },
  {
    id: 'van-2',
    licensePlate: '31-67890-02',
    model: 'Ford Transit',
    driverId: '12' // Youcef Ibrahim Belaidi
  }
];

const TripLoggerForm = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const { addTrip } = useTripContext();
  const { users } = useRBAC();
  const { formData, handleInputChange, handleUserSelection, resetForm, getTripData } = useTripForm();

  // Get drivers from users data (those with driver roles)
  const drivers = users.filter(user => 
    user.role === 'Chauffeur Armé' || user.role === 'Chauffeur Sans Armé'
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.vanId || !formData.companyId || !formData.branchId) {
      toast({
        title: t.error,
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    // Find the selected driver
    const selectedVan = MOCK_VANS.find(van => van.id === formData.vanId);
    const selectedDriver = drivers.find(driver => driver.id.toString() === selectedVan?.driverId);
    
    if (!selectedDriver) {
      toast({
        title: t.error,
        description: "Driver not found for selected van",
        variant: "destructive",
      });
      return;
    }

    // Find the selected company and branch names
    const selectedCompany = MOCK_COMPANIES.find(company => company.id === formData.companyId);
    const selectedBranch = selectedCompany?.branches.find(branch => branch.id === formData.branchId);

    if (!selectedCompany || !selectedBranch) {
      toast({
        title: t.error,
        description: "Company or branch not found",
        variant: "destructive",
      });
      return;
    }

    const tripData = {
      van: selectedVan.licensePlate,
      driver: selectedDriver.name,
      company: selectedCompany.name,
      branch: selectedBranch.name,
      notes: formData.notes,
      userIds: formData.selectedUserIds,
    };

    addTrip(tripData);
    resetForm();
    
    toast({
      title: t.success,
      description: "Trip logged successfully",
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
                  {MOCK_VANS.map((van) => (
                    <SelectItem key={van.id} value={van.id}>
                      {van.licensePlate} - {van.model}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="company">{t.selectCompany}</Label>
              <Select value={formData.companyId} onValueChange={(value) => handleInputChange('companyId', value)}>
                <SelectTrigger>
                  <SelectValue placeholder={t.selectCompany} />
                </SelectTrigger>
                <SelectContent>
                  {MOCK_COMPANIES.map((company) => (
                    <SelectItem key={company.id} value={company.id}>
                      {company.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {formData.companyId && (
            <div>
              <Label htmlFor="branch">{t.selectBranch}</Label>
              <Select value={formData.branchId} onValueChange={(value) => handleInputChange('branchId', value)}>
                <SelectTrigger>
                  <SelectValue placeholder={t.selectBranch} />
                </SelectTrigger>
                <SelectContent>
                  {MOCK_COMPANIES
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

          <UserSelectionSection
            selectedUserIds={formData.selectedUserIds}
            onUserSelection={handleUserSelection}
            userSearchQuery=""
            setUserSearchQuery={() => {}}
          />

          <div>
            <Label htmlFor="notes">{t.notes}</Label>
            <Textarea
              id="notes"
              placeholder="Add notes (optional)"
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
