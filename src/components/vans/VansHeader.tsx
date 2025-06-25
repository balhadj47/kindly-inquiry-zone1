
import React from 'react';
import { PlusButton } from '@/components/ui/plus-button';
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
          <PlusButton onClick={onAddVan} />
        </div>
      </div>
    </div>
  );
};

export default VansHeader;
