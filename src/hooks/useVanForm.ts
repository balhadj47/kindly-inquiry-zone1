
import { useState, useEffect } from 'react';

export interface VanFormData {
  plateNumber: string;
  model: string;
}

export const useVanForm = (van: any) => {
  const [formData, setFormData] = useState<VanFormData>({
    plateNumber: '',
    model: '',
  });

  useEffect(() => {
    if (van) {
      setFormData({
        plateNumber: van.license_plate || van.plateNumber || '',
        model: van.model || '',
      });
    } else {
      setFormData({
        plateNumber: '',
        model: '',
      });
    }
  }, [van]);

  const handleInputChange = (field: keyof VanFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleDateChange = () => {
    // No longer needed as we removed date fields
  };

  return {
    formData,
    handleInputChange,
    handleDateChange,
  };
};
