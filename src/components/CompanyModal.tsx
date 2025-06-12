
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCompaniesActions } from '@/hooks/useCompaniesActions';
import { Company } from '@/hooks/useCompanies';
import { toast } from 'sonner';

interface CompanyModalProps {
  isOpen: boolean;
  onClose: () => void;
  company: Company | null;
  onSuccess?: () => void;
}

const CompanyModal = ({ isOpen, onClose, company, onSuccess }: CompanyModalProps) => {
  const { t } = useLanguage();
  const { createCompany, updateCompany, isLoading } = useCompaniesActions();
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: '',
    email: '',
    branches: [] as string[],
  });
  const [newBranch, setNewBranch] = useState('');

  useEffect(() => {
    if (company) {
      setFormData({
        name: company.name,
        address: company.address || '',
        phone: company.phone || '',
        email: company.email || '',
        branches: company.branches?.map(b => b.name) || [],
      });
    } else {
      setFormData({
        name: '',
        address: '',
        phone: '',
        email: '',
        branches: [],
      });
    }
  }, [company]);

  const handleAddBranch = () => {
    if (newBranch.trim() && !formData.branches.includes(newBranch.trim())) {
      setFormData(prev => ({
        ...prev,
        branches: [...prev.branches, newBranch.trim()]
      }));
      setNewBranch('');
    }
  };

  const handleRemoveBranch = (branchToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      branches: prev.branches.filter(branch => branch !== branchToRemove)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error('Company name is required');
      return;
    }

    try {
      if (company) {
        await updateCompany(company.id, formData);
        toast.success('Company updated successfully');
      } else {
        await createCompany(formData);
        toast.success('Company created successfully');
      }
      
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error('Error saving company:', error);
      toast.error('Error saving company');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {company ? t.editCompany : t.addNewCompany}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="company-name">{t.companyName} *</Label>
            <Input
              id="company-name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder={t.enterCompanyName}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="company-address">{t.address}</Label>
            <Input
              id="company-address"
              value={formData.address}
              onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
              placeholder={t.enterAddress}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="company-phone">{t.phone}</Label>
              <Input
                id="company-phone"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                placeholder={t.enterPhone}
                type="tel"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="company-email">{t.email}</Label>
              <Input
                id="company-email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                placeholder={t.enterEmail}
                type="email"
              />
            </div>
          </div>

          <div className="space-y-4">
            <Label>{t.branches}</Label>
            
            {/* Add Branch Input */}
            <div className="flex space-x-2">
              <Input
                value={newBranch}
                onChange={(e) => setNewBranch(e.target.value)}
                placeholder={t.enterBranchName}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddBranch())}
              />
              <Button type="button" onClick={handleAddBranch} variant="outline">
                {t.addBranch}
              </Button>
            </div>

            {/* Branches List */}
            {formData.branches.length > 0 && (
              <div className="space-y-2">
                <Label className="text-sm text-gray-600">{t.currentBranches}:</Label>
                <div className="flex flex-wrap gap-2">
                  {formData.branches.map((branch, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {branch}
                      <button
                        type="button"
                        onClick={() => handleRemoveBranch(branch)}
                        className="ml-1 hover:text-red-600"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              {t.cancel}
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : (company ? t.updateCompany : t.createCompany)}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CompanyModal;
