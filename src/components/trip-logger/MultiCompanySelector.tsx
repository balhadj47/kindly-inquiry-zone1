
import React, { useState, useMemo } from 'react';
import { Check, Plus, X, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCompaniesBase } from '@/hooks/useCompaniesOptimized';
import { useCompanyBranches } from '@/hooks/useBranchesOptimized';
import { Skeleton } from '@/components/ui/skeleton';
import { CompanyBranchSelection } from '@/types/company-selection';

interface MultiCompanySelectorProps {
  selectedCompanies: CompanyBranchSelection[];
  onSelectionChange: (companies: CompanyBranchSelection[]) => void;
}

const MultiCompanySelector: React.FC<MultiCompanySelectorProps> = ({
  selectedCompanies,
  onSelectionChange
}) => {
  const { t } = useLanguage();
  const { data: companies = [], isLoading: isLoadingCompanies } = useCompaniesBase();
  
  const [newSelection, setNewSelection] = useState({
    companyId: '',
    branchId: ''
  });

  const { data: branches = [], isLoading: isLoadingBranches } = useCompanyBranches(
    newSelection.companyId || null
  );

  const selectedCompanyIds = useMemo(() => 
    selectedCompanies.map(c => c.companyId), 
    [selectedCompanies]
  );

  const availableCompanies = useMemo(() => 
    companies.filter(company => !selectedCompanyIds.includes(company.id)),
    [companies, selectedCompanyIds]
  );

  const handleAddCompany = () => {
    if (!newSelection.companyId || !newSelection.branchId) return;

    const company = companies.find(c => c.id === newSelection.companyId);
    const branch = branches.find(b => b.id === newSelection.branchId);

    if (!company || !branch) return;

    const newCompanySelection: CompanyBranchSelection = {
      companyId: company.id,
      companyName: company.name,
      branchId: branch.id,
      branchName: branch.name
    };

    onSelectionChange([...selectedCompanies, newCompanySelection]);
    setNewSelection({ companyId: '', branchId: '' });
  };

  const handleRemoveCompany = (companyId: string) => {
    onSelectionChange(selectedCompanies.filter(c => c.companyId !== companyId));
  };

  const handleCompanyChange = (companyId: string) => {
    setNewSelection({ companyId, branchId: '' });
  };

  const canAddCompany = newSelection.companyId && newSelection.branchId;

  return (
    <div className="space-y-4">
      {/* Selected Companies */}
      {selectedCompanies.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Entreprises sélectionnées</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {selectedCompanies.map((selection) => (
              <div
                key={selection.companyId}
                className="flex items-center justify-between p-3 bg-muted rounded-lg"
              >
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary">{selection.companyName}</Badge>
                  <span className="text-sm text-muted-foreground">→</span>
                  <Badge variant="outline">{selection.branchName}</Badge>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveCompany(selection.companyId)}
                  className="text-destructive hover:text-destructive"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Add New Company */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Ajouter une entreprise</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="company">{t.selectCompany}</Label>
              {isLoadingCompanies ? (
                <Skeleton className="h-10 w-full" />
              ) : (
                <Select 
                  value={newSelection.companyId} 
                  onValueChange={handleCompanyChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t.selectCompany} />
                  </SelectTrigger>
                  <SelectContent>
                    {availableCompanies.map((company) => (
                      <SelectItem key={company.id} value={company.id}>
                        {company.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>

            {newSelection.companyId && (
              <div>
                <Label htmlFor="branch">{t.selectBranch}</Label>
                {isLoadingBranches ? (
                  <Skeleton className="h-10 w-full" />
                ) : (
                  <Select 
                    value={newSelection.branchId} 
                    onValueChange={(branchId) => 
                      setNewSelection(prev => ({ ...prev, branchId }))
                    }
                  >
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

          <Button
            onClick={handleAddCompany}
            disabled={!canAddCompany}
            className="w-full"
          >
            <Plus className="w-4 h-4 mr-2" />
            Ajouter cette entreprise
          </Button>
        </CardContent>
      </Card>

      {selectedCompanies.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <Building2 className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>Aucune entreprise sélectionnée</p>
          <p className="text-sm">Sélectionnez au moins une entreprise pour continuer</p>
        </div>
      )}
    </div>
  );
};

export default MultiCompanySelector;
