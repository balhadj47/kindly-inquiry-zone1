
export const getStatusColor = (status: string) => {
  switch (status) {
    case 'active':
      return 'text-emerald-600';
    case 'completed':
      return 'text-blue-600';
    case 'terminated':
      return 'text-red-600';
    default:
      return 'text-gray-600';
  }
};

export const getStatusText = (status: string) => {
  switch (status) {
    case 'active':
      return 'Active';
    case 'completed':
      return 'Terminée';
    case 'terminated':
      return 'Annulée';
    default:
      return 'Statut Inconnu';
  }
};
