
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const DriverModal = ({ isOpen, onClose, driver }) => {
  const [formData, setFormData] = useState({
    name: '',
    licenseNumber: '',
    phone: '',
    email: '',
    status: 'Available',
  });

  useEffect(() => {
    if (driver) {
      setFormData({
        name: driver.name,
        licenseNumber: driver.licenseNumber,
        phone: driver.phone,
        email: driver.email,
        status: driver.status,
      });
    } else {
      setFormData({
        name: '',
        licenseNumber: '',
        phone: '',
        email: '',
        status: 'Available',
      });
    }
  }, [driver]);

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, you would submit this data to your backend
    console.log('Submitting driver data:', formData);
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
            {driver ? 'Edit Driver' : 'Add New Driver'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Driver Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="e.g., John Smith"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="license-number">License Number</Label>
            <Input
              id="license-number"
              value={formData.licenseNumber}
              onChange={(e) => handleInputChange('licenseNumber', e.target.value)}
              placeholder="e.g., DL123456789"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              placeholder="e.g., +1 (555) 123-4567"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="e.g., john.smith@company.com"
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
                <SelectItem value="Available">Available</SelectItem>
                <SelectItem value="On Trip">On Trip</SelectItem>
                <SelectItem value="Unavailable">Unavailable</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {driver ? 'Update Driver' : 'Create Driver'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default DriverModal;
