
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Car, Plus, Search } from 'lucide-react';

interface VansEnhancedEmptyStateProps {
  searchTerm: string;
  onAddVan: () => void;
  onClearSearch?: () => void;
}

const VansEnhancedEmptyState: React.FC<VansEnhancedEmptyStateProps> = ({ 
  searchTerm, 
  onAddVan,
  onClearSearch 
}) => {
  return (
    <div className="flex items-center justify-center min-h-[500px]">
      <Card className="w-full max-w-md mx-auto shadow-lg border-gray-200">
        <CardContent className="text-center py-12 px-8">
          <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center">
            {searchTerm ? (
              <Search className="h-10 w-10 text-blue-500" />
            ) : (
              <Car className="h-10 w-10 text-blue-500" />
            )}
          </div>
          
          <h3 className="text-xl font-semibold text-gray-900 mb-3">
            {searchTerm ? 'Aucun résultat trouvé' : 'Aucune camionnette'}
          </h3>
          
          <p className="text-gray-600 mb-8 leading-relaxed">
            {searchTerm 
              ? `Aucune camionnette ne correspond à "${searchTerm}". Essayez d'ajuster votre recherche ou vos filtres.`
              : 'Commencez par ajouter votre première camionnette pour gérer votre flotte de véhicules.'
            }
          </p>
          
          <div className="space-y-3">
            {searchTerm && onClearSearch ? (
              <Button 
                onClick={onClearSearch}
                variant="outline"
                className="w-full h-11 rounded-lg border-gray-300 hover:bg-gray-50 shadow-sm"
              >
                <Search className="h-4 w-4 mr-2" />
                Effacer la recherche
              </Button>
            ) : null}
            
            <Button 
              onClick={onAddVan}
              className="w-full h-11 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
            >
              <Plus className="h-5 w-5 mr-2" />
              {searchTerm ? 'Ajouter une nouvelle camionnette' : 'Ajouter votre première camionnette'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VansEnhancedEmptyState;
