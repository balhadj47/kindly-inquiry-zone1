
import React from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const TripHistoryHeader = () => {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Missions</h1>
        <p className="text-gray-500 mt-2">Consultez l'historique complet de toutes les missions</p>
      </div>
      <Button variant="outline" className="mt-4 md:mt-0">
        <Download className="h-4 w-4 mr-2" />
        {t.export}
      </Button>
    </div>
  );
};

export default TripHistoryHeader;
