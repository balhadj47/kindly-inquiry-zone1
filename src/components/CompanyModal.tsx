
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';

const CompanyModal = ({ isOpen, onClose, company }) => {
  const [formData, setFormData] = useState({
    name: '',
    branches: [],
  });
  const [newBranch, setNewBranch] = useState('');

  useEffect(() => {
    if (company) {
      setFormData({
        name: company.name,
        branches: company.branches || [],
      });
    } else {
      setFormData({
        name: '',
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

  const handleRemoveBranch = (branchToRemove) => {
    setFormData(prev => ({
      ...prev,
      branches: prev.branches.filter(branch => branch !== branchToRemove)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, you would submit this data to your backend
    console.log('Submitting company data:', formData);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {company ? 'Edit Company' : 'Add New Company'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="company-name">Company Name</Label>
            <Input
              id="company-name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Enter company name"
              required
            />
          </div>

          <div className="space-y-4">
            <Label>Branches</Label>
            
            {/* Add Branch Input */}
            <div className="flex space-x-2">
              <Input
                value={newBranch}
                onChange={(e) => setNewBranch(e.target.value)}
                placeholder="Enter branch name"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddBranch())}
              />
              <Button type="button" onClick={handleAddBranch} variant="outline">
                Add
              </Button>
            </div>

            {/* Branches List */}
            {formData.branches.length > 0 && (
              <div className="space-y-2">
                <Label className="text-sm text-gray-600">Current Branches:</Label>
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
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {company ? 'Update Company' : 'Create Company'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CompanyModal;
