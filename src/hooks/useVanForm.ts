
import { useState, useEffect } from 'react';

export interface VanFormData {
  plateNumber: string;
  carNumberPlate: string;
  model: string;
  status: string;
  insuranceDate: Date | null;
  controlDate: Date | null;
  insurer: string;
  notes: string;
}

export const useVanForm = (van: any) => {
  const [formData, setFormData] = useState<VanFormData>({
    plateNumber: '',
    carNumberPlate: '',
    model: '',
    status: 'Active',
    insuranceDate: null,
    controlDate: null,
    insurer: '',
    notes: '',
  });

  useEffect(() => {
    if (van) {
      setFormData({
        plateNumber: van.license_plate || van.plateNumber || '',
        carNumberPlate: van.carNumberPlate || '',
        model: van.model || '',
        status: van.status || 'Active',
        insuranceDate: van.insuranceDate ? new Date(van.insuranceDate) : null,
        controlDate: van.controlDate ? new Date(van.controlDate) : null,
        insurer: van.insurer || '',
        notes: van.notes || '',
      });
    } else {
      setFormData({
        plateNumber: '',
        carNumberPlate: '',
        model: '',
        status: 'Active',
        insuranceDate: null,
        controlDate: null,
        insurer: '',
        notes: '',
      });
    }
  }, [van]);

  const handleInputChange = (field: keyof VanFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleDateChange = (field: 'insuranceDate' | 'controlDate', date: Date | undefined) => {
    setFormData(prev => ({ ...prev, [field]: date || null }));
  };

  return {
    formData,
    handleInputChange,
    handleDateChange,
  };
};
