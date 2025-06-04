
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const VanModal = ({ isOpen, onClose, van }) => {
  const [formData, setFormData] = useState({
    plateNumber: '',
    carNumberPlate: '',
    model: '',
    status: 'Active',
  });

  useEffect(() => {
    if (van) {
      setFormData({
        plateNumber: van.plateNumber,
        carNumberPlate: van.carNumberPlate || '',
        model: van.model,
        status: van.status,
      });
    } else {
      setFormData({
        plateNumber: '',
        carNumberPlate: '',
        model: '',
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
      <DialogContent className="sm:max-w-[500px] w-[95vw] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl">
            {van ? 'Edit Van' : 'Add New Van'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          <div className="space-y-2">
            <Label htmlFor="plate-number" className="text-sm sm:text-base">Plate Number</Label>
            <Input
              id="plate-number"
              value={formData.plateNumber}
              onChange={(e) => handleInputChange('plateNumber', e.target.value)}
              placeholder="e.g., VAN-001"
              className="text-base touch-manipulation"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="car-number-plate" className="text-sm sm:text-base">Car Number Plate</Label>
            <Input
              id="car-number-plate"
              value={formData.carNumberPlate}
              onChange={(e) => handleInputChange('carNumberPlate', e.target.value)}
              placeholder="e.g., ABC-123"
              className="text-base touch-manipulation"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="model" className="text-sm sm:text-base">Van Model</Label>
            <Input
              id="model"
              value={formData.model}
              onChange={(e) => handleInputChange('model', e.target.value)}
              placeholder="e.g., Ford Transit"
              className="text-base touch-manipulation"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status" className="text-sm sm:text-base">Status</Label>
            <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
              <SelectTrigger className="text-base touch-manipulation">
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

          <div className="flex flex-col sm:flex-row justify-end gap-3 sm:space-x-2 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              className="order-2 sm:order-1 touch-manipulation"
              size="lg"
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              className="order-1 sm:order-2 touch-manipulation"
              size="lg"
            >
              {van ? 'Update Van' : 'Create Van'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default VanModal;
