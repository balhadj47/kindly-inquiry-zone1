
export const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'active':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'inactive':
      return 'bg-red-100 text-red-800 border-red-200';
    case 'suspended':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'récupération':
      return 'bg-orange-100 text-orange-800 border-orange-200';
    case 'congé':
    case 'congé maladie':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

export const getRoleColor = (systemGroup: string) => {
  if (systemGroup.includes('Administrator')) return 'bg-purple-50 text-purple-700 border-purple-200';
  if (systemGroup.includes('Chef')) return 'bg-blue-50 text-blue-700 border-blue-200';
  if (systemGroup.includes('Chauffeur')) return 'bg-green-50 text-green-700 border-green-200';
  if (systemGroup.includes('APS')) return 'bg-orange-50 text-orange-700 border-orange-200';
  return 'bg-gray-50 text-gray-700 border-gray-200';
};

export const getUserInitials = (name: string) => {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};
