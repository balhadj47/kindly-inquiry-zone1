
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Truck, Users, Factory } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { usePermissionCheck } from '@/hooks/usePermissionCheck';

const DashboardActions: React.FC = () => {
  const navigate = useNavigate();
  const { canCreateTrips, canCreateVans, canCreateUsers, canCreateCompanies } = usePermissionCheck();

  const quickActions = [
    {
      label: 'Nouvelle Mission',
      icon: Plus,
      action: () => navigate('/log-trip'),
      permission: canCreateTrips,
      color: 'bg-blue-600 hover:bg-blue-700'
    },
    {
      label: 'Nouveau Véhicule',
      icon: Truck,
      action: () => navigate('/vans'),
      permission: canCreateVans,
      color: 'bg-green-600 hover:bg-green-700'
    },
    {
      label: 'Nouvel Employé',
      icon: Users,
      action: () => navigate('/employees'),
      permission: canCreateUsers,
      color: 'bg-purple-600 hover:bg-purple-700'
    },
    {
      label: 'Nouvelle Entreprise',
      icon: Factory,
      action: () => navigate('/companies'),
      permission: canCreateCompanies,
      color: 'bg-orange-600 hover:bg-orange-700'
    }
  ];

  const allowedActions = quickActions.filter(action => action.permission);

  if (allowedActions.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {allowedActions.map((action, index) => (
        <Button
          key={index}
          onClick={action.action}
          className={`h-16 flex flex-col items-center justify-center gap-2 ${action.color} text-white`}
        >
          <action.icon className="h-5 w-5" />
          <span className="text-sm font-medium">{action.label}</span>
        </Button>
      ))}
    </div>
  );
};

export default DashboardActions;
