
import React, { useState, useMemo, useEffect } from 'react';
import { Plus, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCompaniesBase } from '@/hooks/useCompaniesOptimized';
import { useCompanyBranches } from '@/hooks/useBranchesOptimized';
import { Skeleton } from '@/components/ui/skeleton';
import { CompanyBranchSelection } from '@/types/company-selection';
import SelectedCompanyCard from './SelectedCompanyCard';

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

  // Create a set of selected company-branch combinations to prevent duplicates
  const selectedCombinations = useMemo(() => 
    new Set(selectedCompanies.map(c => `${c.companyId}-${c.branchId}`)),
    [selectedCompanies]
  );

  // Filter available branches based on what's already selected for this company
  const availableBranches = useMemo(() => {
    if (!newSelection.companyId) return branches;
    
    const selectedBranchIds = selectedCompanies
      .filter(c => c.companyId === newSelection.companyId)
      .map(c => c.branchId);
    
    return branches.filter(branch => !selectedBranchIds.includes(branch.id));
  }, [branches, newSelection.companyId, selectedCompanies]);

  // Automatically add selection when both company and branch are selected
  useEffect(() => {
    if (newSelection.companyId && newSelection.branchId) {
      const combinationKey = `${newSelection.companyId}-${newSelection.branchId}`;
      
      // Check if this combination already exists
      if (selectedCombinations.has(combinationKey)) {
        // Reset selection if already exists
        setNewSelection({ companyId: '', branchId: '' });
        return;
      }

      const company = companies.find(c => c.id === newSelection.companyId);
      const branch = branches.find(b => b.id === newSelection.branchId);

      if (company && branch) {
        const newCompanySelection: CompanyBranchSelection = {
          companyId: company.id,
          companyName: company.name,
          branchId: branch.id,
          branchName: branch.name
        };

        onSelectionChange([...selectedCompanies, newCompanySelection]);
        setNewSelection({ companyId: '', branchId: '' });
      }
    }
  }, [newSelection.companyId, newSelection.branchId, companies, branches, selectedCompanies, selectedCombinations, onSelectionChange]);

  const handleRemoveCompany = (index: number) => {
    const updatedCompanies = selectedCompanies.filter((_, i) => i !== index);
    onSelectionChange(updatedCompanies);
  };

  const handleCompanyChange = (companyId: string) => {
    setNewSelection({ companyId, branchId: '' });
  };

  return (
    <div className="space-y-6">
      {/* Selected Companies */}
      {selectedCompanies.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Building2 className="h-5 w-5 text-blue-600" />
            Entreprises sélectionnées ({selectedCompanies.length})
          </h3>
          <div className="grid gap-4">
            {selectedCompanies.map((selection, index) => (
              <SelectedCompanyCard
                key={`${selection.companyId}-${selection.branchId}-${index}`}
                company={selection}
                onRemove={() => handleRemoveCompany(index)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Add New Company */}
      <Card className="border-2 border-dashed border-gray-300 hover:border-blue-400 transition-colors">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg flex items-center gap-2">
            <Plus className="h-5 w-5 text-blue-600" />
            Ajouter une entreprise
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="company" className="text-sm font-medium text-gray-700">
                {t.selectCompany}
              </Label>
              {isLoadingCompanies ? (
                <Skeleton className="h-10 w-full mt-1" />
              ) : (
                <Select 
                  value={newSelection.companyId} 
                  onValueChange={handleCompanyChange}
                >
                  <SelectTrigger className="mt-1">
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

            {newSelection.companyId && (
              <div>
                <Label htmlFor="branch" className="text-sm font-medium text-gray-700">
                  {t.selectBranch}
                </Label>
                {isLoadingBranches ? (
                  <Skeleton className="h-10 w-full mt-1" />
                ) : (
                  <Select 
                    value={newSelection.branchId} 
                    onValueChange={(branchId) => 
                      setNewSelection(prev => ({ ...prev, branchId }))
                    }
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder={t.selectBranch} />
                    </SelectTrigger>
                    <SelectContent>
                      {availableBranches.map((branch) => (
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

          <div className="text-sm text-gray-500 bg-blue-50 p-3 rounded-md border border-blue-200">
            <p className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-blue-600" />
              L'entreprise sera automatiquement ajoutée une fois que vous sélectionnez une succursale
            </p>
          </div>
        </CardContent>
      </Card>

      {selectedCompanies.length === 0 && (
        <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
          <Building2 className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-medium text-gray-700 mb-2">Aucune entreprise sélectionnée</h3>
          <p className="text-sm">Sélectionnez au moins une entreprise pour continuer</p>
        </div>
      )}
    </div>
  );
};

export default MultiCompanySelector;
