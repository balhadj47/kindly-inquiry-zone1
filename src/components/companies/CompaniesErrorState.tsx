
import React from 'react';
import CompaniesHeader from './CompaniesHeader';

interface CompaniesErrorStateProps {
  onAdd: () => void;
  onRefresh: () => void;
  isRefreshing: boolean;
}

const CompaniesErrorState = ({ 
  onAdd, 
  onRefresh, 
  isRefreshing 
}: CompaniesErrorStateProps) => {
  return (
    <div className="space-y-4 sm:space-y-6">
      <CompaniesHeader 
        onAdd={onAdd} 
        onRefresh={onRefresh}
        isRefreshing={isRefreshing}
      />
      <div className="text-center py-8">
        <h2 className="text-xl font-semibold mb-2 text-red-600">Erreur de chargement</h2>
        <p className="text-gray-600 mb-4">Impossible de charger les entreprises</p>
      </div>
    </div>
  );
};

export default CompaniesErrorState;
