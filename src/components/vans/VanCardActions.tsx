
import React from 'react';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, Eye } from 'lucide-react';
import { usePermissionCheck } from '@/hooks/usePermissionCheck';

interface Van {
  id: string;
  reference_code: string;
  model: string;
  license_plate?: string;
  status?: string;
  insurer?: string;
  insurance_date?: string;
  control_date?: string;
  notes?: string;
  created_at: string;
  updated_at?: string;
}

interface VanCardActionsProps {
  van: Van;
  onEdit?: (van: Van) => void;
  onDelete?: (van: Van) => void;
  onView: (van: Van) => void;
}

const VanCardActions: React.FC<VanCardActionsProps> = ({
  van,
  onEdit,
  onDelete,
  onView
}) => {
  const { canUpdateVans, canDeleteVans } = usePermissionCheck();

  console.log('🚐 VanCardActions: Van data for actions:', van);
  console.log('🚐 VanCardActions: Can update vans:', canUpdateVans);

  const handleEdit = () => {
    console.log('🚐 VanCardActions: Edit clicked for van:', van);
    if (onEdit && van) {
      onEdit(van);
    } else {
      console.error('🚐 VanCardActions: No edit handler or van data missing');
    }
  };

  const handleDelete = () => {
    console.log('🚐 VanCardActions: Delete clicked for van:', van);
    if (onDelete && van) {
      onDelete(van);
    }
  };

  const handleView = () => {
    console.log('🚐 VanCardActions: View clicked for van:', van);
    if (van) {
      onView(van);
    }
  };

  return (
    <div className="flex items-center gap-1">
      <Button
        variant="ghost"
        size="sm"
        onClick={handleView}
        className="h-8 w-8 p-0"
      >
        <Eye className="h-4 w-4" />
      </Button>
      
      {canUpdateVans && onEdit && (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleEdit}
          className="h-8 w-8 p-0"
        >
          <Edit className="h-4 w-4" />
        </Button>
      )}
      
      {canDeleteVans && onDelete && (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleDelete}
          className="h-8 w-8 p-0 text-destructive hover:text-destructive"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};

export default VanCardActions;
