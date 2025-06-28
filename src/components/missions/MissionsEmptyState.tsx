
import React from 'react';
import { Bell } from 'lucide-react';

interface MissionsEmptyStateProps {
  searchTerm: string;
  statusFilter: string;
}

const MissionsEmptyState: React.FC<MissionsEmptyStateProps> = ({
  searchTerm,
  statusFilter,
}) => {
  return (
    <div className="text-center py-16">
      <div className="text-gray-300 mb-6">
        <Bell className="h-20 w-20 mx-auto" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-3">
        Aucune mission trouvée
      </h3>
      <p className="text-gray-500 max-w-md mx-auto">
        {searchTerm || statusFilter !== 'all' 
          ? 'Aucune mission ne correspond aux filtres actuels.'
          : 'Aucune mission n\'a été créée pour le moment.'
        }
      </p>
    </div>
  );
};

export default MissionsEmptyState;
