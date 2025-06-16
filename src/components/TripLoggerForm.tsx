import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useTripForm } from '@/hooks/useTripForm';
import { useTrip } from '@/contexts/TripContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCompanies } from '@/hooks/useCompanies';
import { useVans } from '@/hooks/useVans';
import RoleSelectionSection from './RoleSelectionSection';
import VanSelector from './trip-logger/VanSelector';
import CompanyBranchSelector from './trip-logger/CompanyBranchSelector';
import { validateTripForm } from './trip-logger/TripFormValidation';
import { useTripSubmission } from './trip-logger/TripFormSubmission';

const TripLoggerForm = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const { trips } = useTrip();
  const { companies } = useCompanies();
  const { vans } = useVans();
  const { formData, handleInputChange, handleUserRoleSelection, resetForm } = useTripForm();
  const { submitTrip } = useTripSubmission();
  const [userSearchQuery, setUserSearchQuery] = useState('');

  // Filter out vans that are currently in active trips using van ID
  const activeTrips = trips.filter(trip => trip.status === 'active');
  const activeVanIds = activeTrips.map(trip => trip.van);
  const availableVans = vans.filter(van => !activeVanIds.includes(van.id));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validation = validateTripForm(formData);
    if (!validation.isValid) {
      toast({
        title: t.error,
        description: validation.errorMessage,
        variant: "destructive",
      });
      return;
    }

    try {
      await submitTrip(formData);
      resetForm();
      setUserSearchQuery('');
      
      toast({
        title: t.success,
        description: t.tripLoggedSuccessfully,
      });
    } catch (error) {
      toast({
        title: t.error,
        description: error instanceof Error ? error.message : 'An error occurred',
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{t.logNewTrip}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <VanSelector
            availableVans={availableVans}
            totalVans={vans}
            selectedVanId={formData.vanId}
            onVanChange={(value) => handleInputChange('vanId', value)}
          />

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

          <CompanyBranchSelector
            companies={companies}
            selectedCompanyId={formData.companyId}
            selectedBranchId={formData.branchId}
            onCompanyChange={(value) => handleInputChange('companyId', value)}
            onBranchChange={(value) => handleInputChange('branchId', value)}
          />

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
