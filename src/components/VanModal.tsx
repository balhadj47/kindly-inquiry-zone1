
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const VanModal = ({ isOpen, onClose, van }) => {
  const [formData, setFormData] = useState({
    plateNumber: '',
    model: '',
    driver: '',
    status: 'Active',
  });

  useEffect(() => {
    if (van) {
      setFormData({
        plateNumber: van.plateNumber,
        model: van.model,
        driver: van.driver,
        status: van.status,
      });
    } else {
      setFormData({
        plateNumber: '',
        model: '',
        driver: '',
        status: 'Active',
      });
    }
  }, [van]);

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, you would submit this data to your backend
    console.log('Submitting van data:', formData);
    onClose();
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {van ? 'Edit Van' : 'Add New Van'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="plate-number">Plate Number</Label>
            <Input
              id="plate-number"
              value={formData.plateNumber}
              onChange={(e) => handleInputChange('plateNumber', e.target.value)}
              placeholder="e.g., VAN-001"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="model">Van Model</Label>
            <Input
              id="model"
              value={formData.model}
              onChange={(e) => handleInputChange('model', e.target.value)}
              placeholder="e.g., Ford Transit"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="driver">Driver Name</Label>
            <Input
              id="driver"
              value={formData.driver}
              onChange={(e) => handleInputChange('driver', e.target.value)}
              placeholder="Enter driver name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="In Transit">In Transit</SelectItem>
                <SelectItem value="Maintenance">Maintenance</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {van ? 'Update Van' : 'Create Van'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default VanModal;
