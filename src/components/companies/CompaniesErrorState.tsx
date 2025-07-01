
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, RefreshCw, Plus, Shield } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface CompaniesErrorStateProps {
  onAdd?: () => void;
  onRefresh: () => void;
  isRefreshing: boolean;
  error?: Error;
}

const CompaniesErrorState: React.FC<CompaniesErrorStateProps> = ({
  onAdd,
  onRefresh,
  isRefreshing,
  error
}) => {
  const { t } = useLanguage();

  // Check if it's a permission error
  const isPermissionError = error?.message?.includes('permission') || 
                           error?.message?.includes('Authentication required');

  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
            {isPermissionError ? (
              <Shield className="h-6 w-6 text-red-600" />
            ) : (
              <AlertTriangle className="h-6 w-6 text-red-600" />
            )}
          </div>
          <CardTitle className="text-xl">
            {isPermissionError ? 'Accès refusé' : 'Erreur de chargement'}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-gray-600">
            {isPermissionError 
              ? 'Vous n\'avez pas les permissions nécessaires pour accéder aux entreprises.'
              : 'Impossible de charger les entreprises. Vérifiez votre connexion et réessayez.'
            }
          </p>
          
          {error && !isPermissionError && (
            <div className="text-xs text-gray-500 bg-gray-100 p-2 rounded">
              {error.message}
            </div>
          )}

          <div className="flex gap-3 justify-center">
            <Button 
              onClick={onRefresh} 
              disabled={isRefreshing}
              variant="outline"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              {isRefreshing ? 'Actualisation...' : 'Réessayer'}
            </Button>
            
            {onAdd && !isPermissionError && (
              <Button onClick={onAdd}>
                <Plus className="h-4 w-4 mr-2" />
                {t.addNewCompany}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CompaniesErrorState;
