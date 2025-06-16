
export const calculateDashboardStats = (
  users: any[],
  vans: any[],
  companies: any[]
) => {
  const activeVans = vans.filter(van => van.status === 'Actif' || !van.status).length;
  const totalUsers = users.length;
  const totalCompanies = companies.length;
  const totalBranches = companies.reduce((sum, company) => sum + company.branches.length, 0);

  return [
    { title: 'Voyages Aujourd\'hui', value: '0', change: '0', color: 'text-green-600' },
    { title: 'Camionnettes Actives', value: activeVans.toString(), change: `${activeVans}`, color: 'text-blue-600' },
    { title: 'Entreprises Servies', value: totalCompanies.toString(), change: `${totalCompanies}`, color: 'text-gray-600' },
    { title: 'Total Succursales', value: totalBranches.toString(), change: `${totalBranches}`, color: 'text-purple-600' },
  ];
};

export const createChartData = (companies: any[]) => {
  const dailyTrips = [
    { date: 'Lun', trips: 0 },
    { date: 'Mar', trips: 0 },
    { date: 'Mer', trips: 0 },
    { date: 'Jeu', trips: 0 },
    { date: 'Ven', trips: 0 },
    { date: 'Sam', trips: 0 },
    { date: 'Dim', trips: 0 },
  ];

  const topBranches = companies.length > 0 ? companies.slice(0, 4).map((company, index) => ({
    name: company.name,
    visits: 0,
    color: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'][index] || '#3B82F6'
  })) : [
    { name: 'Aucune succursale', visits: 0, color: '#9CA3AF' }
  ];

  return { dailyTrips, topBranches };
};
