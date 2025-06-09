
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Building2, Plus } from 'lucide-react';

interface CompaniesEmptyStateProps {
  searchTerm: string;
  onAddCompany: () => void;
}

const CompaniesEmptyState = ({ searchTerm, onAddCompany }: CompaniesEmptyStateProps) => {
  return (
    <Card>
      <CardContent className="text-center py-12">
        <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune entreprise trouvée</h3>
        <p className="text-gray-600 mb-4">
          {searchTerm 
            ? "Essayez d'ajuster votre recherche" 
            : "Commencez par ajouter votre première entreprise"
          }
        </p>
        {!searchTerm && (
          <Button onClick={onAddCompany}>
            <Plus className="h-4 w-4 mr-2" />
            Ajouter Votre Première Entreprise
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default CompaniesEmptyState;
