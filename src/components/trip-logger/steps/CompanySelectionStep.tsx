
import React from 'react';
import { Building2 } from 'lucide-react';
import CompanyBranchSelector from '../CompanyBranchSelector';

interface Company {
  id: string;
  name: string;
  branches: Array<{ id: string; name: string }>;
}

interface CompanySelectionStepProps {
  companies: Company[];
  selectedCompanyId: string;
  selectedBranchId: string;
  onCompanyChange: (companyId: string) => void;
  onBranchChange: (branchId: string) => void;
}

const CompanySelectionStep: React.FC<CompanySelectionStepProps> = ({
  companies,
  selectedCompanyId,
  selectedBranchId,
  onCompanyChange,
  onBranchChange
}) => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 rounded-full mb-3">
          <Building2 className="w-6 h-6 text-purple-600" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">Sélection de l'entreprise</h3>
        <p className="text-gray-600">Choisissez l'entreprise et la succursale pour cette mission</p>
      </div>

      <CompanyBranchSelector
        companies={companies}
        selectedCompanyId={selectedCompanyId}
        selectedBranchId={selectedBranchId}
        onCompanyChange={onCompanyChange}
        onBranchChange={onBranchChange}
      />
    </div>
  );
};

export default CompanySelectionStep;
