
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapIcon } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTripContext } from '@/contexts/TripContext';
import { useRBAC } from '@/contexts/RBACContext';
import { useTripForm, TripFormData } from '@/hooks/useTripForm';
import UserSelectionSection from './UserSelectionSection';

interface TripLoggerFormProps {
  userSearchQuery: string;
  setUserSearchQuery: (query: string) => void;
}

const TripLoggerForm: React.FC<TripLoggerFormProps> = ({
  userSearchQuery,
  setUserSearchQuery,
}) => {
  const { t } = useLanguage();
  const { addTrip } = useTripContext();
  const { users } = useRBAC();
  const { formData, handleInputChange, handleUserSelection, resetForm } = useTripForm();

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

  const handleSubmit = (e: React.FormEvent) => {
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
    resetForm();
    setUserSearchQuery('');
  };

  return (
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

          <UserSelectionSection
            userSearchQuery={userSearchQuery}
            setUserSearchQuery={setUserSearchQuery}
            selectedUserIds={formData.selectedUserIds}
            onUserSelection={handleUserSelection}
          />

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
  );
};

export default TripLoggerForm;
