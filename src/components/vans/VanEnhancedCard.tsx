
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Edit, 
  Trash2,
  Calendar,
  FileText,
  Car,
  AlertTriangle,
  Shield
} from 'lucide-react';
import { format } from 'date-fns';
import { Van } from '@/types/van';
import { EntityCard } from '@/components/ui/entity-card';
import { Button } from '@/components/ui/button';

interface VanEnhancedCardProps {
  van: Van;
  onEdit: (van: Van) => void;
  onQuickAction: (van: Van) => void;
  onDelete: (van: Van) => void;
}

const VanEnhancedCard = React.memo(({ van, onEdit, onQuickAction, onDelete }: VanEnhancedCardProps) => {
  // Check if dates are expired
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const insuranceDate = van.insurance_date ? new Date(van.insurance_date) : null;
  const controlDate = van.control_date ? new Date(van.control_date) : null;
  
  const isInsuranceExpired = insuranceDate && insuranceDate < today;
  const isControlExpired = controlDate && controlDate < today;
  const hasExpiredDocs = isInsuranceExpired || isControlExpired;

  const getStatusConfig = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return { variant: 'default' as const, color: 'green' };
      case 'inactive':
        return { variant: 'secondary' as const, color: 'gray' };
      case 'maintenance':
        return { variant: 'outline' as const, color: 'orange' };
      case 'en transit':
        return { variant: 'default' as const, color: 'blue' };
      default:
        return { variant: 'secondary' as const, color: 'gray' };
    }
  };

  const getVanInitials = (model: string, licensePlate: string) => {
    if (model) {
      return model.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    }
    if (licensePlate) {
      return licensePlate.slice(0, 2).toUpperCase();
    }
    return 'VN';
  };

  const statusConfig = getStatusConfig(van.status || 'Active');

  const metadata = [
    {
      label: 'Plaque',
      value: van.license_plate || 'Non définie',
      icon: <Car className="h-4 w-4" />
    },
    van.reference_code && {
      label: 'Référence',
      value: van.reference_code,
      icon: <FileText className="h-4 w-4" />
    },
    van.insurer && {
      label: 'Assureur',
      value: van.insurer,
      icon: <Shield className="h-4 w-4" />
    },
    van.insurance_date && {
      label: 'Assurance',
      value: format(new Date(van.insurance_date), 'dd/MM/yyyy') + (isInsuranceExpired ? ' (Exp.)' : ''),
      icon: <Calendar className={`h-4 w-4 ${isInsuranceExpired ? 'text-red-500' : 'text-green-500'}`} />
    },
    van.control_date && {
      label: 'Contrôle',
      value: format(new Date(van.control_date), 'dd/MM/yyyy') + (isControlExpired ? ' (Exp.)' : ''),
      icon: <Calendar className={`h-4 w-4 ${isControlExpired ? 'text-red-500' : 'text-green-500'}`} />
    }
  ].filter(Boolean);

  const actions = (
    <div className="flex items-center gap-2">
      <Button
        onClick={() => onEdit(van)}
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0 bg-blue-500 text-white hover:bg-blue-600"
      >
        <Edit className="h-4 w-4" />
      </Button>
      <Button
        onClick={() => onDelete(van)}
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0 bg-red-500 text-white hover:bg-red-600"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );

  return (
    <EntityCard
      title={van.model || 'Modèle non défini'}
      status={{
        label: van.status || 'Active',
        variant: statusConfig.variant,
        color: statusConfig.color
      }}
      metadata={metadata}
      actions={actions}
      onClick={() => onQuickAction(van)}
      className="group hover:shadow-md transition-all duration-200 border-gray-200 hover:border-gray-300"
    >
      <div className="flex items-center space-x-3 mb-4">
        <Avatar className="h-12 w-12 ring-1 ring-gray-200 group-hover:ring-gray-300 transition-all duration-200">
          <AvatarImage 
            src={`https://api.dicebear.com/7.x/initials/svg?seed=${van.model || van.license_plate}`}
            alt={van.model || van.license_plate}
          />
          <AvatarFallback className="bg-gray-600 text-white font-medium">
            {getVanInitials(van.model || '', van.license_plate || '')}
          </AvatarFallback>
        </Avatar>
        <div className="text-xs text-gray-500">
          Créé le: {new Date(van.created_at).toLocaleDateString('fr-FR')}
        </div>
      </div>

      {hasExpiredDocs && (
        <div className="mb-4">
          <Badge variant="destructive" className="bg-red-50 text-red-700 border-red-200">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Documents expirés
          </Badge>
        </div>
      )}

      {van.notes && (
        <div className="mt-4 p-3 bg-blue-50/50 border border-blue-200/50 rounded-lg">
          <div className="flex items-start space-x-2">
            <FileText className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-xs text-blue-600 font-medium mb-1">Notes</p>
              <p className="text-sm text-gray-700 leading-relaxed">
                {van.notes.length > 80 ? `${van.notes.slice(0, 80)}...` : van.notes}
              </p>
            </div>
          </div>
        </div>
      )}
    </EntityCard>
  );
});

VanEnhancedCard.displayName = 'VanEnhancedCard';

export default VanEnhancedCard;
