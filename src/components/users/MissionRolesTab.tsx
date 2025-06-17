
import React, { useState } from 'react';
import { TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Target, Shield, Car, UserCheck, Edit, Trash2, Info } from 'lucide-react';
import { MISSION_ROLES, MissionRole } from '@/types/missionRoles';
import MissionRoleModal from './MissionRoleModal';

const MissionRolesTab: React.FC = () => {
  const [selectedRole, setSelectedRole] = useState<MissionRole | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<any>(null);

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

  const handleAddRole = () => {
    setEditingRole(null);
    setIsModalOpen(true);
  };

  const handleEditRole = (role: any) => {
    setEditingRole(role);
    setIsModalOpen(true);
  };

  const handleDeleteRole = (roleId: string) => {
    // Implementation for deleting role template
    console.log('Delete role template:', roleId);
  };

  return (
    <TabsContent value="mission-roles" className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Modèles de Rôles de Mission</h2>
          <p className="text-muted-foreground">
            Gérez les modèles de rôles disponibles pour l'assignation aux missions
          </p>
        </div>
        <Button onClick={handleAddRole}>
          <Plus className="h-4 w-4 mr-2" />
          Nouveau Modèle
        </Button>
      </div>

      {/* Important Notice */}
      <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-md">
        <div className="flex items-start">
          <Info className="h-5 w-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
          <div>
            <h3 className="font-medium text-blue-900 mb-1">À propos des rôles de mission</h3>
            <p className="text-sm text-blue-800">
              Ces modèles définissent les types de rôles disponibles. Les rôles sont assignés aux utilisateurs 
              <strong> lors de la création de missions spécifiques</strong>, pas de manière permanente.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {MISSION_ROLES.map((role) => {
          const IconComponent = getRoleIcon(role.name);
          const colorClass = getRoleColor(role.name);
          
          return (
            <Card key={role.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex items-center space-x-2">
                    <IconComponent className="h-5 w-5" />
                    <CardTitle className="text-lg">{role.name}</CardTitle>
                  </div>
                  <div className="flex space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditRole(role)}
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteRole(role.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
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

      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-medium text-gray-900 mb-3">Comment fonctionnent les rôles de mission</h3>
        <div className="space-y-3 text-sm text-gray-700">
          <div className="flex items-start space-x-2">
            <Target className="h-4 w-4 mt-0.5 text-gray-500 flex-shrink-0" />
            <span>Ces modèles définissent les types de rôles opérationnels disponibles</span>
          </div>
          <div className="flex items-start space-x-2">
            <UserCheck className="h-4 w-4 mt-0.5 text-gray-500 flex-shrink-0" />
            <span>Les rôles sont assignés aux utilisateurs lors de la création de missions dans "Logger un trajet"</span>
          </div>
          <div className="flex items-start space-x-2">
            <Shield className="h-4 w-4 mt-0.5 text-gray-500 flex-shrink-0" />
            <span>Un utilisateur peut avoir différents rôles selon les missions (ex: Chauffeur sur une mission, APS sur une autre)</span>
          </div>
          <div className="flex items-start space-x-2">
            <Car className="h-4 w-4 mt-0.5 text-gray-500 flex-shrink-0" />
            <span>Ces rôles sont différents des groupes système qui contrôlent les permissions d'application</span>
          </div>
        </div>
      </div>

      <MissionRoleModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        role={editingRole}
      />
    </TabsContent>
  );
};

export default MissionRolesTab;
