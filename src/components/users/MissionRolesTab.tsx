
import React, { useState } from 'react';
import { TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Target, Shield, Car, UserCheck } from 'lucide-react';
import { MISSION_ROLES, MissionRole } from '@/types/missionRoles';

const MissionRolesTab: React.FC = () => {
  const [selectedRole, setSelectedRole] = useState<MissionRole | null>(null);

  const getRoleIcon = (role: MissionRole) => {
    switch (role) {
      case 'Chef de Groupe': return Shield;
      case 'Chauffeur': return Car;
      case 'APS': return UserCheck;
      case 'Armé': return Target;
      default: return Target;
    }
  };

  const getRoleColor = (role: MissionRole) => {
    switch (role) {
      case 'Chef de Groupe': return 'bg-red-100 text-red-800';
      case 'Chauffeur': return 'bg-blue-100 text-blue-800';
      case 'APS': return 'bg-green-100 text-green-800';
      case 'Armé': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <TabsContent value="mission-roles" className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Rôles de Mission</h2>
          <p className="text-muted-foreground">
            Gérez les rôles disponibles pour les missions
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Nouveau Rôle
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {MISSION_ROLES.map((role) => {
          const IconComponent = getRoleIcon(role.name);
          const colorClass = getRoleColor(role.name);
          
          return (
            <Card key={role.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <IconComponent className="h-5 w-5" />
                  <span className="text-lg">{role.name}</span>
                </CardTitle>
                <CardDescription>{role.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Badge variant="outline" className={`text-xs font-medium ${colorClass}`}>
                    {role.category}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-medium text-blue-900 mb-2">Comment utiliser les rôles de mission</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Les rôles de mission sont assignés aux utilisateurs pour des missions spécifiques</li>
          <li>• Un utilisateur peut avoir plusieurs rôles de mission</li>
          <li>• Ces rôles sont différents des groupes système qui contrôlent les permissions d'application</li>
        </ul>
      </div>
    </TabsContent>
  );
};

export default MissionRolesTab;
