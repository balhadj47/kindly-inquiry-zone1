
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, AlertTriangle, Clock, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const QuickActions: React.FC = () => {
  const navigate = useNavigate();

  const actions = [
    {
      title: 'Nouveau Voyage',
      description: 'Enregistrer un nouveau programme',
      icon: <Plus className="h-5 w-5" />,
      color: 'bg-blue-500 hover:bg-blue-600',
      onClick: () => navigate('/trip-logger')
    },
    {
      title: 'Historique',
      description: 'Voir tous les voyages',
      icon: <Clock className="h-5 w-5" />,
      color: 'bg-green-500 hover:bg-green-600',
      onClick: () => navigate('/trip-history')
    },
    {
      title: 'Gestion',
      description: 'Gérer les utilisateurs',
      icon: <Users className="h-5 w-5" />,
      color: 'bg-purple-500 hover:bg-purple-600',
      onClick: () => navigate('/users')
    },
    {
      title: 'Camionnettes',
      description: 'État de la flotte',
      icon: <AlertTriangle className="h-5 w-5" />,
      color: 'bg-orange-500 hover:bg-orange-600',
      onClick: () => navigate('/vans')
    }
  ];

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle className="text-base sm:text-lg font-semibold text-gray-900">
          Actions Rapides
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {actions.map((action, index) => (
            <Button
              key={index}
              variant="outline"
              className={`h-auto p-4 flex flex-col items-center gap-2 text-white border-0 ${action.color} transition-all duration-200 hover:scale-105`}
              onClick={action.onClick}
            >
              {action.icon}
              <div className="text-center">
                <div className="text-sm font-semibold">{action.title}</div>
                <div className="text-xs opacity-90">{action.description}</div>
              </div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActions;
