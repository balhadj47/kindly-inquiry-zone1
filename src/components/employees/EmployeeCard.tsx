
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Edit, Phone, Mail, MapPin, Calendar, CreditCard, Trash } from 'lucide-react';
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
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Inactive': return 'bg-gray-100 text-gray-800';
      case 'Suspended': return 'bg-red-100 text-red-800';
      case 'Récupération': return 'bg-blue-100 text-blue-800';
      case 'Congé': return 'bg-yellow-100 text-yellow-800';
      case 'Congé maladie': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const userInitials = employee.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase();

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={employee.profileImage} />
              <AvatarFallback className="bg-green-600 text-white font-bold">
                {userInitials}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-lg">{employee.name}</h3>
              <Badge className={getStatusColor(employee.status)}>
                {employee.status}
              </Badge>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            {canEdit && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(employee)}
              >
                <Edit className="h-4 w-4" />
              </Button>
            )}
            {canDelete && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(employee)}
                className="text-destructive hover:text-destructive"
              >
                <Trash className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        {employee.badgeNumber && (
          <div className="flex items-center space-x-2 text-sm">
            <CreditCard className="h-4 w-4 text-gray-500" />
            <span className="text-gray-600">Badge: {employee.badgeNumber}</span>
          </div>
        )}
        
        {employee.phone && (
          <div className="flex items-center space-x-2 text-sm">
            <Phone className="h-4 w-4 text-gray-500" />
            <span className="text-gray-600">{employee.phone}</span>
          </div>
        )}
        
        {employee.email && (
          <div className="flex items-center space-x-2 text-sm">
            <Mail className="h-4 w-4 text-gray-500" />
            <span className="text-gray-600">{employee.email}</span>
          </div>
        )}
        
        {employee.address && (
          <div className="flex items-center space-x-2 text-sm">
            <MapPin className="h-4 w-4 text-gray-500" />
            <span className="text-gray-600">{employee.address}</span>
          </div>
        )}
        
        {employee.dateOfBirth && (
          <div className="flex items-center space-x-2 text-sm">
            <Calendar className="h-4 w-4 text-gray-500" />
            <span className="text-gray-600">Né le {employee.dateOfBirth}</span>
          </div>
        )}
        
        <div className="pt-2 border-t">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Missions: {employee.totalTrips || 0}</span>
            <span>Permis: {employee.driverLicense || 'N/A'}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmployeeCard;
