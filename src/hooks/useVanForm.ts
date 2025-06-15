
import { useState, useEffect } from 'react';

export interface VanFormData {
  referenceCode: string;
  plateNumber: string;
  model: string;
  status: string;
  insurer: string;
  insuranceDate: Date | undefined;
  controlDate: Date | undefined;
  notes: string;
}

export const useVanForm = (van: any) => {
  const [formData, setFormData] = useState<VanFormData>({
    referenceCode: '',
    plateNumber: '',
    model: '',
    status: 'Active',
    insurer: '',
    insuranceDate: undefined,
    controlDate: undefined,
    notes: '',
  });

  useEffect(() => {
    if (van) {
      setFormData({
        referenceCode: van.reference_code || '',
        plateNumber: van.license_plate || van.plateNumber || '',
        model: van.model || '',
        status: van.status || 'Active',
        insurer: van.insurer || '',
        insuranceDate: van.insurance_date ? new Date(van.insurance_date) : undefined,
        controlDate: van.control_date ? new Date(van.control_date) : undefined,
        notes: van.notes || '',
      });
    } else {
      setFormData({
        referenceCode: '',
        plateNumber: '',
        model: '',
        status: 'Active',
        insurer: '',
        insuranceDate: undefined,
        controlDate: undefined,
        notes: '',
      });
    }
  }, [van]);

  const handleInputChange = (field: keyof VanFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleDateChange = (field: keyof VanFormData, date: Date | undefined) => {
    setFormData(prev => ({ ...prev, [field]: date }));
  };

  return {
    formData,
    handleInputChange,
    handleDateChange,
  };
};
