
import React from 'react';
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
      <div>
        <h3 className="text-lg font-semibold mb-4">Sélection de l'entreprise et de la succursale</h3>
        <CompanyBranchSelector
          companies={companies}
          selectedCompanyId={selectedCompanyId}
          selectedBranchId={selectedBranchId}
          onCompanyChange={onCompanyChange}
          onBranchChange={onBranchChange}
        />
      </div>
    </div>
  );
};

export default CompanySelectionStep;
