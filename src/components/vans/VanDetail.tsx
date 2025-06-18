
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Edit, Car } from 'lucide-react';
import { useVan } from '@/hooks/useVansOptimized';

const VanDetail = () => {
  const { vanId } = useParams();
  const navigate = useNavigate();
  const { data: van, isLoading } = useVan(vanId || null);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!van) {
    return (
      <div className="text-center py-12">
        <Car className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Camionnette non trouvée</h3>
        <Button onClick={() => navigate('/vans')}>
          Retour aux camionnettes
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/vans')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>
          <h1 className="text-2xl font-bold text-gray-900">{van.model}</h1>
        </div>
        <Button>
          <Edit className="h-4 w-4 mr-2" />
          Modifier
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Détails de la camionnette</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Plaque d'immatriculation</label>
              <p className="text-lg font-semibold">{van.license_plate}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Modèle</label>
              <p className="text-lg">{van.model}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Code de référence</label>
              <p className="text-lg">{van.reference_code || 'N/A'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Statut</label>
              <p className="text-lg">{van.status}</p>
            </div>
            {van.insurer && (
              <div>
                <label className="text-sm font-medium text-gray-500">Assureur</label>
                <p className="text-lg">{van.insurer}</p>
              </div>
            )}
            {van.insurance_date && (
              <div>
                <label className="text-sm font-medium text-gray-500">Date d'assurance</label>
                <p className="text-lg">{new Date(van.insurance_date).toLocaleDateString()}</p>
              </div>
            )}
          </div>
          {van.notes && (
            <div className="mt-6">
              <label className="text-sm font-medium text-gray-500">Notes</label>
              <p className="text-base mt-1 p-3 bg-gray-50 rounded-lg">{van.notes}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default VanDetail;
