
export const getStatusColor = (status: string) => {
  switch (status) {
    case 'Actif': return 'bg-green-100 text-green-800';
    case 'En Transit': return 'bg-blue-100 text-blue-800';
    case 'Maintenance': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

export const getFuelLevelColor = (level: number) => {
  if (level > 50) return 'text-green-600';
  if (level > 25) return 'text-yellow-600';
  return 'text-red-600';
};

export const getEfficiencyColor = (efficiency: number) => {
  if (efficiency >= 90) return 'text-green-600';
  if (efficiency >= 80) return 'text-yellow-600';
  return 'text-red-600';
};

export const transformVanData = (vans: any[]) => {
  return vans.map(van => ({
    ...van,
    carNumberPlate: van.license_plate,
    totalTrips: 0,
    lastTrip: 'Jamais',
    currentLocation: 'Garage',
    fuelLevel: 75,
    nextMaintenance: 'À planifier',
    driver: van.driver_id ? `Chauffeur ${van.driver_id}` : 'Non assigné',
    efficiency: 85,
    mileage: '0 km',
    yearlyTrips: 0,
    status: van.status || 'Actif'
  }));
};
