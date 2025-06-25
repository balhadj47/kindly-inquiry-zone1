
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Car, Plus } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface VanListEmptyStateProps {
  searchTerm: string;
  statusFilter: string;
  onAddVan: () => void;
}

const VanListEmptyState = ({ searchTerm, statusFilter, onAddVan }: VanListEmptyStateProps) => {
  const { t } = useLanguage();

  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <Card className="w-full max-w-md">
        <CardContent className="text-center py-8">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <Car className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{t.noVansFound}</h3>
          <p className="text-sm text-gray-600 mb-6">
            {searchTerm || statusFilter !== 'all' 
              ? t.tryAdjustingFiltersOrSearch
              : t.startByAddingFirstVan
            }
          </p>
          {(!searchTerm && statusFilter === 'all') && (
            <Button 
              onClick={onAddVan} 
              className="w-full h-10 rounded-md bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
            >
              <Plus className="h-4 w-4 mr-2" />
              {t.addYourFirstVan}
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default VanListEmptyState;
