
import React from 'react';
import { Building2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import CompanyBranchSelectorOptimized from '../CompanyBranchSelectorOptimized';

interface SelectedCompany {
  companyId: string;
  branchId: string;
  companyName?: string;
  branchName?: string;
}

interface MultiCompanySelectionStepProps {
  selectedCompanies: SelectedCompany[];
  onAddCompany: (companyId: string, branchId: string) => void;
  onRemoveCompany: (index: number) => void;
}

const MultiCompanySelectionStep: React.FC<MultiCompanySelectionStepProps> = ({
  selectedCompanies,
  onAddCompany,
  onRemoveCompany
}) => {
  const [tempCompanyId, setTempCompanyId] = React.useState('');
  const [tempBranchId, setTempBranchId] = React.useState('');

  const handleAddCompany = () => {
    if (tempCompanyId && tempBranchId) {
      // Check if this company-branch combination already exists
      const exists = selectedCompanies.some(
        sc => sc.companyId === tempCompanyId && sc.branchId === tempBranchId
      );
      
      if (!exists) {
        onAddCompany(tempCompanyId, tempBranchId);
        setTempCompanyId('');
        setTempBranchId('');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 rounded-full mb-3">
          <Building2 className="w-6 h-6 text-purple-600" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">Sélection des entreprises</h3>
        <p className="text-gray-600">Choisissez les entreprises et succursales pour cette mission</p>
      </div>

      {/* Current selections */}
      {selectedCompanies.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-medium text-gray-900">Entreprises sélectionnées :</h4>
          <div className="space-y-2">
            {selectedCompanies.map((company, index) => (
              <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                <div>
                  <p className="font-medium">{company.companyName || company.companyId}</p>
                  <p className="text-sm text-gray-600">{company.branchName || company.branchId}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onRemoveCompany(index)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add new company */}
      <div className="space-y-4">
        <h4 className="font-medium text-gray-900">Ajouter une entreprise :</h4>
        <CompanyBranchSelectorOptimized
          selectedCompanyId={tempCompanyId}
          selectedBranchId={tempBranchId}
          onCompanyChange={setTempCompanyId}
          onBranchChange={setTempBranchId}
        />
        
        <Button 
          onClick={handleAddCompany}
          disabled={!tempCompanyId || !tempBranchId}
          className="w-full"
        >
          Ajouter cette entreprise
        </Button>
      </div>

      {selectedCompanies.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          Aucune entreprise sélectionnée. Ajoutez au moins une entreprise pour continuer.
        </div>
      )}
    </div>
  );
};

export default MultiCompanySelectionStep;
