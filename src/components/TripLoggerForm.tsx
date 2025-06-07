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

const TripLoggerForm = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const { addTrip } = useTripContext();
  const { companies, vans, drivers } = useRBAC();
  const { formData, handleInputChange, handleUserSelection, resetForm, getTripData } = useTripForm();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.vanId || !formData.companyId || !formData.branchId) {
      toast({
        title: t.error,
        description: t.fillRequiredFields,
        variant: "destructive",
      });
      return;
    }

    // Find the selected driver
    const selectedVan = vans.find(van => van.id === formData.vanId);
    const selectedDriver = drivers.find(driver => driver.id === selectedVan?.driverId);
    
    if (!selectedDriver) {
      toast({
        title: t.error,
        description: "Driver not found for selected van",
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
      userIds: formData.selectedUserIds, // Include userIds to fix the build error
    };

    addTrip(tripData);
    resetForm();
    
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
                  {companies.map((company) => (
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

          <UserSelectionSection
            selectedUserIds={formData.selectedUserIds}
            onUserSelection={handleUserSelection}
          />

          <div>
            <Label htmlFor="notes">{t.notes}</Label>
            <Textarea
              id="notes"
              placeholder={t.addNotesOptional}
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
