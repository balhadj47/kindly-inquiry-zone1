
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLanguage } from '@/contexts/LanguageContext';
import { Branch } from '@/hooks/useCompanies';
import { toast } from 'sonner';

interface BranchModalProps {
  isOpen: boolean;
  onClose: () => void;
  branch: Branch | null;
  companyId: string;
  companyName: string;
  onSuccess: () => void;
}

const BranchModal = ({ isOpen, onClose, branch, companyId, companyName, onSuccess }: BranchModalProps) => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: '',
    email: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (branch) {
      setFormData({
        name: branch.name,
        address: branch.address || '',
        phone: branch.phone || '',
        email: branch.email || '',
      });
    } else {
      setFormData({
        name: '',
        address: '',
        phone: '',
        email: '',
      });
    }
  }, [branch]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error('Branch name is required');
      return;
    }

    setIsLoading(true);
    try {
      const { supabase } = await import('@/integrations/supabase/client');
      
      if (branch) {
        // Update existing branch
        const { error } = await supabase
          .from('branches')
          .update({
            name: formData.name,
            address: formData.address || null,
            phone: formData.phone || null,
            email: formData.email || null,
          })
          .eq('id', branch.id);

        if (error) throw error;
        toast.success('Branch updated successfully');
      } else {
        // Create new branch
        const { error } = await supabase
          .from('branches')
          .insert({
            name: formData.name,
            address: formData.address || null,
            phone: formData.phone || null,
            email: formData.email || null,
            company_id: companyId,
          });

        if (error) throw error;
        toast.success('Branch created successfully');
      }
      
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error saving branch:', error);
      toast.error('Error saving branch');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {branch ? t.editBranch : t.addNewBranch} - {companyName}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="branch-name">{t.branchName} *</Label>
            <Input
              id="branch-name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder={t.enterBranchName}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="branch-address">{t.address}</Label>
            <Input
              id="branch-address"
              value={formData.address}
              onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
              placeholder={t.enterAddress}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="branch-phone">{t.phone}</Label>
              <Input
                id="branch-phone"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                placeholder={t.enterPhone}
                type="tel"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="branch-email">{t.email}</Label>
              <Input
                id="branch-email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                placeholder={t.enterEmail}
                type="email"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              {t.cancel}
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : (branch ? t.updateBranch : t.createBranch)}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default BranchModal;
