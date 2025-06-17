
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, History, Users, Truck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const QuickActions: React.FC = () => {
  const navigate = useNavigate();

  const actions = [
    {
      title: 'Nouveau Voyage',
      description: 'Démarrer un programme',
      icon: <Plus className="h-5 w-5" />,
      gradient: 'from-blue-500 to-blue-600',
      hoverGradient: 'hover:from-blue-600 hover:to-blue-700',
      onClick: () => navigate('/trip-logger')
    },
    {
      title: 'Historique',
      description: 'Voir tous les voyages',
      icon: <History className="h-5 w-5" />,
      gradient: 'from-emerald-500 to-emerald-600',
      hoverGradient: 'hover:from-emerald-600 hover:to-emerald-700',
      onClick: () => navigate('/trip-history')
    },
    {
      title: 'Gestion',
      description: 'Gérer les utilisateurs',
      icon: <Users className="h-5 w-5" />,
      gradient: 'from-purple-500 to-purple-600',
      hoverGradient: 'hover:from-purple-600 hover:to-purple-700',
      onClick: () => navigate('/users')
    },
    {
      title: 'Camionnettes',
      description: 'État de la flotte',
      icon: <Truck className="h-5 w-5" />,
      gradient: 'from-amber-500 to-amber-600',
      hoverGradient: 'hover:from-amber-600 hover:to-amber-700',
      onClick: () => navigate('/vans')
    }
  ];

  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 border-0">
      <CardHeader className="bg-gradient-to-r from-gray-50 to-slate-50 border-b border-gray-100">
        <CardTitle className="text-lg font-bold text-gray-900 flex items-center space-x-2">
          <div className="w-1 h-6 bg-gray-500 rounded-full"></div>
          <span>Actions Rapides</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {actions.map((action, index) => (
            <Button
              key={index}
              variant="outline"
              className={`h-auto p-0 flex flex-col items-center text-white border-0 bg-gradient-to-br ${action.gradient} ${action.hoverGradient} transition-all duration-300 hover:scale-105 hover:shadow-lg relative overflow-hidden group`}
              onClick={action.onClick}
            >
              <div className="absolute top-0 right-0 w-16 h-16 bg-white/10 rounded-full -mr-8 -mt-8 group-hover:scale-110 transition-transform duration-300"></div>
              <div className="relative p-6 flex flex-col items-center space-y-3 w-full">
                <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm group-hover:bg-white/30 transition-colors duration-300">
                  {action.icon}
                </div>
                <div className="text-center">
                  <div className="text-sm font-bold mb-1">{action.title}</div>
                  <div className="text-xs opacity-90 leading-tight">{action.description}</div>
                </div>
              </div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActions;
