
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Car, Plus } from 'lucide-react';

interface VanListEmptyStateProps {
  searchTerm: string;
  statusFilter: string;
  onAddVan: () => void;
}

const VanListEmptyState = ({ searchTerm, statusFilter, onAddVan }: VanListEmptyStateProps) => {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <Card className="w-full max-w-md">
        <CardContent className="text-center py-8">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <Car className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucune camionnette trouvée</h3>
          <p className="text-sm text-gray-600 mb-6">
            {searchTerm || statusFilter !== 'all' 
              ? "Essayez d'ajuster votre recherche ou vos filtres" 
              : "Commencez par ajouter votre première camionnette"
            }
          </p>
          {(!searchTerm && statusFilter === 'all') && (
            <Button onClick={onAddVan} className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Ajouter Votre Première Camionnette
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default VanListEmptyState;
