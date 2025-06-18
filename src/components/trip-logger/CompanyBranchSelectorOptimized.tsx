
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCompaniesBase } from '@/hooks/useCompaniesOptimized';
import { useCompanyBranches } from '@/hooks/useBranchesOptimized';
import { Skeleton } from '@/components/ui/skeleton';

interface CompanyBranchSelectorOptimizedProps {
  selectedCompanyId: string;
  selectedBranchId: string;
  onCompanyChange: (companyId: string) => void;
  onBranchChange: (branchId: string) => void;
}

const CompanyBranchSelectorOptimized: React.FC<CompanyBranchSelectorOptimizedProps> = ({
  selectedCompanyId,
  selectedBranchId,
  onCompanyChange,
  onBranchChange
}) => {
  const { t } = useLanguage();
  const { data: companies = [], isLoading: isLoadingCompanies } = useCompaniesBase();
  const { data: branches = [], isLoading: isLoadingBranches } = useCompanyBranches(selectedCompanyId || null);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <Label htmlFor="company">{t.selectCompany}</Label>
        {isLoadingCompanies ? (
          <Skeleton className="h-10 w-full" />
        ) : (
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
        )}
      </div>

      {selectedCompanyId && (
        <div>
          <Label htmlFor="branch">{t.selectBranch}</Label>
          {isLoadingBranches ? (
            <Skeleton className="h-10 w-full" />
          ) : (
            <Select value={selectedBranchId} onValueChange={onBranchChange}>
              <SelectTrigger>
                <SelectValue placeholder={t.selectBranch} />
              </SelectTrigger>
              <SelectContent>
                {branches.map((branch) => (
                  <SelectItem key={branch.id} value={branch.id}>
                    {branch.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      )}
    </div>
  );
};

export default CompanyBranchSelectorOptimized;
