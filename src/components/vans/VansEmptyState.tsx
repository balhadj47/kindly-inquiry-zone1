
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Car, Plus } from 'lucide-react';

interface VansEmptyStateProps {
  searchTerm: string;
  onAddVan: () => void;
}

const VansEmptyState = ({ searchTerm, onAddVan }: VansEmptyStateProps) => {
  return (
    <Card>
      <CardContent className="text-center py-12">
        <Car className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune camionnette trouvée</h3>
        <p className="text-gray-600 mb-4">
          {searchTerm 
            ? "Essayez d'ajuster votre recherche" 
            : "Commencez par ajouter votre première camionnette"
          }
        </p>
        {!searchTerm && (
          <Button 
            onClick={onAddVan}
            className="w-auto h-10 px-4 rounded-md bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
          >
            <Plus className="h-4 w-4 mr-2" />
            Ajouter Votre Première Camionnette
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default VansEmptyState;
