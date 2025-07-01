
import React from 'react';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, Eye } from 'lucide-react';
import { usePermissionCheck } from '@/hooks/usePermissionCheck';

interface Company {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
}

interface CompanyCardActionsProps {
  company: Company;
  onEdit?: (company: Company) => void;
  onDelete?: (company: Company) => void;
  onView: (company: Company) => void;
}

const CompanyCardActions: React.FC<CompanyCardActionsProps> = ({
  company,
  onEdit,
  onDelete,
  onView
}) => {
  const { canUpdateCompanies, canDeleteCompanies } = usePermissionCheck();

  return (
    <div className="flex items-center gap-1">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onView(company)}
        className="h-8 w-8 p-0"
      >
        <Eye className="h-4 w-4" />
      </Button>
      
      {canUpdateCompanies && onEdit && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onEdit(company)}
          className="h-8 w-8 p-0"
        >
          <Edit className="h-4 w-4" />
        </Button>
      )}
      
      {canDeleteCompanies && onDelete && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDelete(company)}
          className="h-8 w-8 p-0 text-destructive hover:text-destructive"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};

export default CompanyCardActions;
