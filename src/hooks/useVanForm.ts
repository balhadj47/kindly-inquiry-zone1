
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
  currentLocation: string;
  currentResponsibleId: number | null;
  currentOdometerKm: number;
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
    currentLocation: '',
    currentResponsibleId: null,
    currentOdometerKm: 0,
  });

  useEffect(() => {
    console.log('🚐 useVanForm: Van data received:', van);
    
    if (van) {
      const newFormData = {
        referenceCode: van.reference_code || '',
        plateNumber: van.license_plate || van.plateNumber || '',
        model: van.model || '',
        status: van.status || 'Active',
        insurer: van.insurer || '',
        insuranceDate: van.insurance_date ? new Date(van.insurance_date) : undefined,
        controlDate: van.control_date ? new Date(van.control_date) : undefined,
        notes: van.notes || '',
        currentLocation: van.current_location || '',
        currentResponsibleId: van.current_responsible_id || null,
        currentOdometerKm: van.current_odometer_km || 0,
      };
      
      console.log('🚐 useVanForm: Setting form data:', newFormData);
      setFormData(newFormData);
    } else {
      console.log('🚐 useVanForm: No van data, resetting form');
      setFormData({
        referenceCode: '',
        plateNumber: '',
        model: '',
        status: 'Active',
        insurer: '',
        insuranceDate: undefined,
        controlDate: undefined,
        notes: '',
        currentLocation: '',
        currentResponsibleId: null,
        currentOdometerKm: 0,
      });
    }
  }, [van]);

  const handleInputChange = (field: keyof VanFormData, value: any) => {
    console.log('🚐 useVanForm: Input change:', field, value);
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleDateChange = (field: keyof VanFormData, date: Date | undefined) => {
    console.log('🚐 useVanForm: Date change:', field, date);
    setFormData(prev => ({ ...prev, [field]: date }));
  };

  console.log('🚐 useVanForm: Current form data:', formData);

  return {
    formData,
    handleInputChange,
    handleDateChange,
  };
};
