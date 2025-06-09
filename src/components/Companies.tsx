
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Building2, Plus, Trash2 } from 'lucide-react';
import CompanyModal from './CompanyModal';
import CompanyDeleteDialog from './CompanyDeleteDialog';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCompanies } from '@/hooks/useCompanies';
import { useCompaniesActions } from '@/hooks/useCompaniesActions';
import { toast } from 'sonner';

const Companies = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const { t } = useLanguage();
  const { companies, loading, error, refetch } = useCompanies();
  const { deleteCompany, isLoading: isDeleting } = useCompaniesActions();

  const filteredCompanies = companies.filter(company =>
    company.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddCompany = () => {
    setSelectedCompany(null);
    setIsModalOpen(true);
  };

  const handleEditCompany = (company) => {
    setSelectedCompany(company);
    setIsModalOpen(true);
  };

  const handleDeleteCompany = (company) => {
    setSelectedCompany(company);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedCompany) return;

    try {
      await deleteCompany(selectedCompany.id);
      toast.success('Entreprise supprimée avec succès');
      setIsDeleteDialogOpen(false);
      setSelectedCompany(null);
      refetch();
    } catch (error) {
      console.error('Error deleting company:', error);
      toast.error('Erreur lors de la suppression de l\'entreprise');
    }
  };

  const handleModalSuccess = () => {
    refetch();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Chargement des entreprises...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-red-600">Erreur: {error}</div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{t.companies}</h1>
        <Button 
          onClick={handleAddCompany} 
          className="w-full sm:w-auto flex items-center justify-center gap-2 touch-manipulation"
          size="lg"
        >
          <Plus className="h-4 w-4" />
          <span className="sm:inline">{t.addNewCompany}</span>
        </Button>
      </div>

      {/* Search Bar */}
      <Card>
        <CardContent className="p-4 sm:pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder={t.searchCompanies}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 text-base touch-manipulation"
            />
          </div>
        </CardContent>
      </Card>

      {/* Empty State */}
      {filteredCompanies.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune entreprise trouvée</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm 
                ? "Essayez d'ajuster votre recherche" 
                : "Commencez par ajouter votre première entreprise"
              }
            </p>
            {!searchTerm && (
              <Button onClick={handleAddCompany}>
                <Plus className="h-4 w-4 mr-2" />
                Ajouter Votre Première Entreprise
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Companies Grid */}
      {filteredCompanies.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
          {filteredCompanies.map((company) => (
            <Card key={company.id} className="hover:shadow-lg transition-shadow touch-manipulation">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start space-x-2 min-w-0 flex-1">
                    <Building2 className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <CardTitle className="text-base sm:text-lg leading-tight break-words">{company.name}</CardTitle>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditCompany(company);
                      }}
                      className="touch-manipulation"
                    >
                      {t.edit}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteCompany(company);
                      }}
                      className="touch-manipulation text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">
                    {t.branches} ({company.branches.length})
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {company.branches.slice(0, 2).map((branch, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {branch.name}
                      </Badge>
                    ))}
                    {company.branches.length > 2 && (
                      <Badge variant="outline" className="text-xs">
                        +{company.branches.length - 2} {t.more}
                      </Badge>
                    )}
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center pt-2 border-t border-gray-100 gap-2">
                  <div className="text-sm text-gray-600">
                    <span className="font-medium text-gray-900">{company.branches.length}</span> succursales
                  </div>
                  <div className="text-xs text-gray-500">
                    Créée le {new Date(company.created_at).toLocaleDateString()}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <CompanyModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        company={selectedCompany}
        onSuccess={handleModalSuccess}
      />

      <CompanyDeleteDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        company={selectedCompany}
        onConfirm={handleConfirmDelete}
        isLoading={isDeleting}
      />
    </div>
  );
};

export default Companies;
