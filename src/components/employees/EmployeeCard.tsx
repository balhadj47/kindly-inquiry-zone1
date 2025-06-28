
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Edit, Trash2, Phone, MapPin, CreditCard, Calendar } from 'lucide-react';
import { User } from '@/types/rbac';

interface EmployeeCardProps {
  employee: User;
  onEdit: (employee: User) => void;
  onDelete: (employee: User) => void;
  canEdit: boolean;
  canDelete: boolean;
}

const EmployeeCard: React.FC<EmployeeCardProps> = ({
  employee,
  onEdit,
  onDelete,
  canEdit,
  canDelete,
}) => {
  const getUserInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800';
      case 'Inactive':
        return 'bg-gray-100 text-gray-800';
      case 'Suspended':
        return 'bg-red-100 text-red-800';
      case 'Récupération':
        return 'bg-blue-100 text-blue-800';
      case 'Congé':
        return 'bg-yellow-100 text-yellow-800';
      case 'Congé maladie':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const showActions = canEdit || canDelete;

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Avatar className="h-12 w-12">
              <AvatarImage 
                src={employee.profileImage || `https://api.dicebear.com/7.x/initials/svg?seed=${employee.name}`}
                alt={employee.name}
              />
              <AvatarFallback className="bg-blue-600 text-white">
                {getUserInitials(employee.name)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-lg">{employee.name}</h3>
              <Badge className={`text-xs ${getStatusColor(employee.status)}`}>
                {employee.status}
              </Badge>
            </div>
          </div>
          
          {showActions && (
            <div className="flex space-x-2">
              {canEdit && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit(employee)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
              )}
              {canDelete && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onDelete(employee)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          )}
        </div>

        <div className="space-y-2 text-sm text-gray-600">
          {employee.badgeNumber && (
            <div className="flex items-center space-x-2">
              <CreditCard className="h-4 w-4" />
              <span>Badge: {employee.badgeNumber}</span>
            </div>
          )}
          
          {employee.phone && (
            <div className="flex items-center space-x-2">
              <Phone className="h-4 w-4" />
              <span>{employee.phone}</span>
            </div>
          )}
          
          {employee.address && (
            <div className="flex items-center space-x-2">
              <MapPin className="h-4 w-4" />
              <span>{employee.address}</span>
            </div>
          )}
          
          {employee.dateOfBirth && (
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4" />
              <span>Né(e) le: {new Date(employee.dateOfBirth).toLocaleDateString('fr-FR')}</span>
            </div>
          )}
        </div>

        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="text-xs text-gray-500">
            Créé le: {new Date(employee.createdAt).toLocaleDateString('fr-FR')}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmployeeCard;
