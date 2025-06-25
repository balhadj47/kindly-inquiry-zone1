
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface VansHeaderProps {
  onAddVan: () => void;
}

const VansHeader: React.FC<VansHeaderProps> = ({ onAddVan }) => {
  const { t } = useLanguage();

  return (
    <div className="space-y-3">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            {t.vansManagement}
          </h1>
          <p className="text-gray-600 mt-1">
            {t.manageYourFleet}
          </p>
        </div>
        
        <div className="flex items-center gap-2 mt-4 lg:mt-0">
          <Button onClick={onAddVan}>
            <Plus className="h-4 w-4 mr-2" />
            Ajouter Camionnette
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VansHeader;
