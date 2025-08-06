
import React, { memo, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Edit, Trash2, Phone, MapPin, CreditCard, Calendar, User, Building, Heart, NotebookPen } from 'lucide-react';
import { User as UserType } from '@/types/rbac';
import { EntityCard } from '@/components/ui/entity-card';
import { Button } from '@/components/ui/button';
import EmployeeNotesModal from './notes/EmployeeNotesModal';

interface EmployeeCardProps {
  employee: UserType;
  onEdit: (employee: UserType) => void;
  onDelete: (employee: UserType) => void;
  canEdit: boolean;
  canDelete: boolean;
}

const EmployeeCard: React.FC<EmployeeCardProps> = memo(({
  employee,
  onEdit,
  onDelete,
  canEdit,
  canDelete,
}) => {
  const [isNotesModalOpen, setIsNotesModalOpen] = useState(false);

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
        return { variant: 'default' as const, color: 'green' };
      case 'Inactive':
        return { variant: 'secondary' as const, color: 'gray' };
      case 'Suspended':
        return { variant: 'destructive' as const, color: 'red' };
      case 'Récupération':
        return { variant: 'outline' as const, color: 'blue' };
      case 'Congé':
        return { variant: 'outline' as const, color: 'yellow' };
      case 'Congé maladie':
        return { variant: 'outline' as const, color: 'orange' };
      default:
        return { variant: 'secondary' as const, color: 'gray' };
    }
  };

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return null;
    try {
      return new Date(dateString).toLocaleDateString('fr-FR');
    } catch {
      return dateString;
    }
  };

  const statusConfig = getStatusColor(employee.status);

  // Only show essential metadata to reduce rendering complexity
  const metadata = [
    employee.badgeNumber && {
      label: 'Badge',
      value: employee.badgeNumber,
      icon: <CreditCard className="h-4 w-4" />
    },
    employee.phone && {
      label: 'Téléphone',
      value: employee.phone,
      icon: <Phone className="h-4 w-4" />
    },
    employee.email && {
      label: 'Email',
      value: employee.email,
      icon: <span>📧</span>
    },
    employee.address && {
      label: 'Adresse',
      value: employee.address,
      icon: <MapPin className="h-4 w-4" />
    },
  ].filter(Boolean);

  const actions = (
    <div className="flex items-center gap-2">
      <Button
        onClick={() => setIsNotesModalOpen(true)}
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0 bg-green-500 text-white hover:bg-green-600"
        title="Ajouter une note"
      >
        <NotebookPen className="h-4 w-4" />
      </Button>
      {canEdit && (
        <Button
          onClick={() => onEdit(employee)}
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 bg-blue-500 text-white hover:bg-blue-600"
        >
          <Edit className="h-4 w-4" />
        </Button>
      )}
      {canDelete && (
        <Button
          onClick={() => onDelete(employee)}
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 bg-red-500 text-white hover:bg-red-600"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      )}
    </div>
  );

  return (
    <>
      <EntityCard
        title={employee.name}
        status={{
          label: employee.status,
          variant: statusConfig.variant,
          color: statusConfig.color
        }}
        metadata={metadata}
        actions={actions}
        className="group hover:shadow-md transition-all duration-200 border-gray-200 hover:border-gray-300"
      >
        <div className="flex items-center space-x-3 mb-4">
          <Avatar className="h-12 w-12 ring-1 ring-gray-200 group-hover:ring-gray-300 transition-all duration-200">
            <AvatarImage 
              src={employee.profileImage || `https://api.dicebear.com/7.x/initials/svg?seed=${employee.name}`}
              alt={employee.name}
            />
            <AvatarFallback className="bg-gray-600 text-white font-medium">
              {getUserInitials(employee.name)}
            </AvatarFallback>
          </Avatar>
          <div className="text-xs text-gray-500">
            Créé le: {new Date(employee.createdAt).toLocaleDateString('fr-FR')}
          </div>
        </div>
      </EntityCard>

      <EmployeeNotesModal
        isOpen={isNotesModalOpen}
        onClose={() => setIsNotesModalOpen(false)}
        employee={employee}
        onSuccess={() => setIsNotesModalOpen(false)}
      />
    </>
  );
});

EmployeeCard.displayName = 'EmployeeCard';

export default EmployeeCard;
