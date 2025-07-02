
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { 
  Edit, 
  Trash2,
  Shield,
  Calendar,
  FileText,
  Car,
  MapPin
} from 'lucide-react';
import { getStatusColor } from '@/utils/vanUtils';
import { format } from 'date-fns';
import { Van } from '@/types/van';
import { EntityCard } from '@/components/ui/entity-card';
import { ActionButton } from '@/components/ui/action-button';

interface VanCardProps {
  van: Van;
  onEdit: (van: Van) => void;
  onQuickAction: (van: Van) => void;
  onDelete: (van: Van) => void;
}

const VanCard = React.memo(({ van, onEdit, onQuickAction, onDelete }: VanCardProps) => {
  const handleEdit = React.useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit(van);
  }, [onEdit, van]);
  
  const handleDelete = React.useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(van);
  }, [onDelete, van]);

  const handleCardClick = React.useCallback(() => {
    onQuickAction(van);
  }, [onQuickAction, van]);

  // Check if dates are expired
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const insuranceDate = van.insurance_date ? new Date(van.insurance_date) : null;
  const controlDate = van.control_date ? new Date(van.control_date) : null;
  
  const isInsuranceExpired = insuranceDate && insuranceDate < today;
  const isControlExpired = controlDate && controlDate < today;

  const getStatusConfig = (status: string | undefined) => {
    switch (status) {
      case 'Active':
        return { variant: 'default' as const, color: 'green' };
      case 'Inactive':
        return { variant: 'secondary' as const, color: 'gray' };
      case 'Maintenance':
        return { variant: 'outline' as const, color: 'orange' };
      case 'En Transit':
        return { variant: 'default' as const, color: 'blue' };
      default:
        return { variant: 'secondary' as const, color: 'gray' };
    }
  };

  const statusConfig = getStatusConfig(van.status);

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
      <ActionButton
        onClick={handleEdit}
        icon={Edit}
        variant="outline"
        size="sm"
      >
        Modifier
      </ActionButton>
      <ActionButton
        onClick={handleDelete}
        icon={Trash2}
        variant="outline"
        size="sm"
        className="text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300"
      >
        Supprimer
      </ActionButton>
    </div>
  );

  return (
    <EntityCard
      title={van.model || 'Modèle non défini'}
      subtitle={van.license_plate}
      status={van.status ? {
        label: van.status,
        variant: statusConfig.variant,
        color: statusConfig.color
      } : undefined}
      metadata={metadata}
      actions={actions}
      onClick={handleCardClick}
      className="transition-all duration-200 hover:shadow-lg"
    >
      {van.notes && (
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
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

VanCard.displayName = 'VanCard';

export default VanCard;
