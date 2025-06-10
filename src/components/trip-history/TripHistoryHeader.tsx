
import React from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

const TripHistoryHeader = () => {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Historique des Voyages</h1>
        <p className="text-gray-500 mt-2">Consultez tous les voyages effectués par votre flotte</p>
      </div>
      <Button variant="outline" className="mt-4 md:mt-0">
        <Download className="h-4 w-4 mr-2" />
        Exporter
      </Button>
    </div>
  );
};

export default TripHistoryHeader;
