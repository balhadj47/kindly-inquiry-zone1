
import React from 'react';
import { Loader2, AlertCircle } from 'lucide-react';

export const LoadingState = () => (
  <div className="flex items-center justify-center min-h-[400px]">
    <div className="text-center">
      <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
      <p className="text-gray-600">Chargement des utilisateurs...</p>
    </div>
  </div>
);

interface ErrorStateProps {
  title?: string;
  message?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({ 
  title = "Erreur de chargement", 
  message = "Une erreur s'est produite lors du chargement des données." 
}) => (
  <div className="flex items-center justify-center min-h-[400px]">
    <div className="text-center max-w-md">
      <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{message}</p>
    </div>
  </div>
);
