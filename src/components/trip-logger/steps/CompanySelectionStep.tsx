
import React from 'react';
import { Building2 } from 'lucide-react';
import MultiCompanySelector from '../MultiCompanySelector';
import { CompanyBranchSelection } from '@/types/company-selection';

interface CompanySelectionStepProps {
  selectedCompanies: CompanyBranchSelection[];
  onCompanySelectionChange: (companies: CompanyBranchSelection[]) => void;
}

const CompanySelectionStep: React.FC<CompanySelectionStepProps> = ({
  selectedCompanies,
  onCompanySelectionChange
}) => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 rounded-full mb-3">
          <Building2 className="w-6 h-6 text-purple-600" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">Sélection des entreprises</h3>
        <p className="text-gray-600">Choisissez une ou plusieurs entreprises et leurs succursales pour cette mission</p>
      </div>

      <MultiCompanySelector
        selectedCompanies={selectedCompanies}
        onSelectionChange={onCompanySelectionChange}
      />
    </div>
  );
};

export default CompanySelectionStep;
