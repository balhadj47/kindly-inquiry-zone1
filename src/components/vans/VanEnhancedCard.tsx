
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { StatusBadge } from '@/components/ui/status-badge';
import { 
  Edit, 
  Trash2,
  Calendar,
  FileText,
  Car,
  AlertTriangle
} from 'lucide-react';
import { format } from 'date-fns';
import { Van } from '@/types/van';
import { EntityCard } from '@/components/ui/entity-card';
import { ActionButton } from '@/components/ui/action-button';

interface VanEnhancedCardProps {
  van: Van;
  onEdit: (van: Van) => void;
  onQuickAction: (van: Van) => void;
  onDelete: (van: Van) => void;
}

const VanEnhancedCard = React.memo(({ van, onEdit, onQuickAction, onDelete }: VanEnhancedCardProps) => {
  const handleEdit = React.useCallback(() => {
    onEdit(van);
  }, [onEdit, van]);
  
  const handleDelete = React.useCallback(() => {
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
  const hasExpiredDocs = isInsuranceExpired || isControlExpired;

  const metadata = [
    {
      label: 'Plaque',
      value: van.license_plate || 'Non définie',
      icon: <Car className="h-4 w-4 text-gray-500" />
    },
    van.reference_code && {
      label: 'Référence',
      value: van.reference_code,
      icon: <FileText className="h-4 w-4 text-gray-500" />
    },
    van.insurance_date && {
      label: 'Assurance',
      value: format(new Date(van.insurance_date), 'dd/MM/yyyy'),
      icon: <Calendar className={`h-4 w-4 ${isInsuranceExpired ? 'text-red-500' : 'text-green-500'}`} />
    },
    van.control_date && {
      label: 'Contrôle',
      value: format(new Date(van.control_date), 'dd/MM/yyyy'),
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
        className="shadow-sm hover:shadow-md"
      >
        Modifier
      </ActionButton>
      <ActionButton
        onClick={handleDelete}
        icon={Trash2}
        variant="outline"
        size="sm"
        className="text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300 shadow-sm hover:shadow-md"
      >
        Supprimer
      </ActionButton>
    </div>
  );

  return (
    <EntityCard
      title={
        <div className="flex items-center gap-2">
          <span className="font-semibold text-lg text-gray-900">
            {van.model || 'Modèle non défini'}
          </span>
          {hasExpiredDocs && (
            <AlertTriangle className="h-4 w-4 text-red-500" />
          )}
        </div>
      }
      subtitle={
        <div className="flex items-center gap-2 mt-1">
          <span className="text-gray-600 font-medium">{van.license_plate}</span>
          {van.insurer && (
            <Badge variant="outline" className="text-xs">
              {van.insurer}
            </Badge>
          )}
        </div>
      }
      status={van.status ? {
        label: van.status,
        variant: 'outline',
        color: 'blue'
      } : undefined}
      metadata={metadata}
      actions={actions}
      onClick={handleCardClick}
      className="transition-all duration-300 hover:shadow-xl hover:scale-[1.02] border-gray-200 hover:border-blue-300 bg-white"
    >
      {/* Status Badge with enhanced styling */}
      <div className="mt-4 flex items-center justify-between">
        <StatusBadge status={van.status || 'Active'} />
        
        {hasExpiredDocs && (
          <Badge variant="destructive" className="bg-red-50 text-red-700 border-red-200">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Documents expirés
          </Badge>
        )}
      </div>

      {van.notes && (
        <div className="mt-4 p-4 bg-blue-50/50 border border-blue-200/50 rounded-lg">
          <div className="flex items-start space-x-2">
            <FileText className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-xs text-blue-600 font-medium mb-1">Notes</p>
              <p className="text-sm text-gray-700 leading-relaxed">
                {van.notes.length > 100 ? `${van.notes.slice(0, 100)}...` : van.notes}
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
