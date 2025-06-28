
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Truck, Calendar, Shield, FileText, Edit, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Van } from '@/types/van';
import { useRBAC } from '@/contexts/RBACContext';

interface VanStatsProps {
  vans: Van[];
  onAddVan: () => void;
  onEditVan: (van: Van) => void;
  onDeleteVan: (van: Van) => void;
}

const VanStats: React.FC<VanStatsProps> = ({ vans, onAddVan, onEditVan, onDeleteVan }) => {
  const navigate = useNavigate();
  const { hasPermission } = useRBAC();
  
  // Check permissions
  const canCreateVans = hasPermission('vans:create');
  const canUpdateVans = hasPermission('vans:update');
  const canDeleteVans = hasPermission('vans:delete');

  const activeVans = vans.filter(van => van.status === 'Active');
  const inactiveVans = vans.filter(van => van.status === 'Inactive');
  const maintenanceVans = vans.filter(van => van.status === 'Maintenance');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800';
      case 'Inactive':
        return 'bg-gray-100 text-gray-800';
      case 'Maintenance':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const showActions = canUpdateVans || canDeleteVans;

  return (
    <div className="space-y-6">
      {/* Header with stats */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Gestion des Fourgons</h2>
        {canCreateVans && (
          <Button onClick={onAddVan} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Ajouter un Fourgon
          </Button>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Fourgons</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{vans.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Actifs</CardTitle>
            <Truck className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{activeVans.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Maintenance</CardTitle>
            <Truck className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{maintenanceVans.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inactifs</CardTitle>
            <Truck className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-600">{inactiveVans.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Vans List */}
      <div className="grid gap-4">
        {vans.map((van) => (
          <Card key={van.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Truck className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{van.reference_code}</h3>
                      <p className="text-gray-600">{van.model}</p>
                    </div>
                    <Badge className={getStatusColor(van.status || 'Active')}>
                      {van.status || 'Active'}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                    {van.license_plate && (
                      <div className="flex items-center space-x-2">
                        <FileText className="h-4 w-4 text-gray-400" />
                        <span>{van.license_plate}</span>
                      </div>
                    )}
                    
                    {van.driver_id && (
                      <div className="flex items-center space-x-2">
                        <span className="text-gray-600">Chauffeur: {van.driver_id}</span>
                      </div>
                    )}
                    
                    {van.control_date && (
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span>Contrôle: {new Date(van.control_date).toLocaleDateString('fr-FR')}</span>
                      </div>
                    )}
                    
                    {van.insurance_date && (
                      <div className="flex items-center space-x-2">
                        <Shield className="h-4 w-4 text-gray-400" />
                        <span>Assurance: {new Date(van.insurance_date).toLocaleDateString('fr-FR')}</span>
                      </div>
                    )}
                  </div>
                  
                  {van.notes && (
                    <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">{van.notes}</p>
                    </div>
                  )}
                </div>
                
                {showActions && (
                  <div className="flex space-x-2">
                    {canUpdateVans && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onEditVan(van)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    )}
                    
                    {canDeleteVans && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onDeleteVan(van)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {vans.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <Truck className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun fourgon</h3>
            <p className="text-gray-500 mb-4">Commencez par ajouter votre premier fourgon.</p>
            {canCreateVans && (
              <Button onClick={onAddVan}>
                <Plus className="h-4 w-4 mr-2" />
                Ajouter un Fourgon
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default VanStats;
