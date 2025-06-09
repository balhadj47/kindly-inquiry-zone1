
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Car, Plus } from 'lucide-react';
import VanCard from './VanCard';

interface VanListProps {
  vans: any[];
  totalVans: number;
  searchTerm: string;
  statusFilter: string;
  onAddVan: () => void;
  onEditVan: (van: any) => void;
  onQuickAction: (action: string, van: any) => void;
  onDeleteVan: (van: any) => void;
}

const VanList = ({ 
  vans, 
  totalVans, 
  searchTerm, 
  statusFilter, 
  onAddVan, 
  onEditVan, 
  onQuickAction,
  onDeleteVan
}: VanListProps) => {
  // Results Summary
  const showSummary = vans.length !== totalVans;

  // Empty State
  if (vans.length === 0) {
    return (
      <>
        {showSummary && (
          <div className="text-sm text-gray-600">
            Affichage de {vans.length} sur {totalVans} camionnettes
          </div>
        )}
        <Card>
          <CardContent className="text-center py-12">
            <Car className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune camionnette trouvée</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || statusFilter !== 'all' 
                ? "Essayez d'ajuster votre recherche ou vos filtres" 
                : "Commencez par ajouter votre première camionnette"
              }
            </p>
            {(!searchTerm && statusFilter === 'all') && (
              <Button onClick={onAddVan}>
                <Plus className="h-4 w-4 mr-2" />
                Ajouter Votre Première Camionnette
              </Button>
            )}
          </CardContent>
        </Card>
      </>
    );
  }

  return (
    <>
      {showSummary && (
        <div className="text-sm text-gray-600">
          Affichage de {vans.length} sur {totalVans} camionnettes
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {vans.map((van) => (
          <VanCard
            key={van.id}
            van={van}
            onEdit={onEditVan}
            onQuickAction={onQuickAction}
            onDelete={onDeleteVan}
          />
        ))}
      </div>
    </>
  );
};

export default VanList;
