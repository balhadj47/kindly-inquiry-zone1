
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useLanguage } from '@/contexts/LanguageContext';

interface Company {
  id: string;
  name: string;
  branches: Array<{ id: string; name: string }>;
}

interface CompanyBranchSelectorProps {
  companies: Company[];
  selectedCompanyId: string;
  selectedBranchId: string;
  onCompanyChange: (companyId: string) => void;
  onBranchChange: (branchId: string) => void;
}

const CompanyBranchSelector: React.FC<CompanyBranchSelectorProps> = ({
  companies,
  selectedCompanyId,
  selectedBranchId,
  onCompanyChange,
  onBranchChange
}) => {
  const { t } = useLanguage();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <Label htmlFor="company">{t.selectCompany}</Label>
        <Select value={selectedCompanyId} onValueChange={onCompanyChange}>
          <SelectTrigger>
            <SelectValue placeholder={t.selectCompany} />
          </SelectTrigger>
          <SelectContent>
            {companies.map((company) => (
              <SelectItem key={company.id} value={company.id}>
                {company.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {selectedCompanyId && (
        <div>
          <Label htmlFor="branch">{t.selectBranch}</Label>
          <Select value={selectedBranchId} onValueChange={onBranchChange}>
            <SelectTrigger>
              <SelectValue placeholder={t.selectBranch} />
            </SelectTrigger>
            <SelectContent>
              {companies
                .find(c => c.id === selectedCompanyId)
                ?.branches.map((branch) => (
                  <SelectItem key={branch.id} value={branch.id}>
                    {branch.name}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
};

export default CompanyBranchSelector;
