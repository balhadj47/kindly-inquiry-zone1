
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Company } from '@/hooks/useCompanies';
import CompanyCard from './CompanyCard';
import VirtualizedList from '@/components/ui/virtualized-list';
import VirtualizedCompanyCard from '@/components/virtualized/VirtualizedCompanyCard';
import { useIsMobile } from '@/hooks/use-mobile';

interface CompaniesGridProps {
  companies: Company[];
  hasActiveFilters: boolean;
  clearFilters: () => void;
  onEditCompany: (company: Company) => void;
  onDeleteCompany: (company: Company) => void;
  currentPage: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}

const CompaniesGrid: React.FC<CompaniesGridProps> = ({
  companies,
  hasActiveFilters,
  clearFilters,
  onEditCompany,
  onDeleteCompany,
  currentPage,
  itemsPerPage,
  onPageChange,
}) => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const totalPages = Math.ceil(companies.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedCompanies = companies.slice(startIndex, endIndex);

  const useVirtualization = companies.length > 50;

  const handleCompanyClick = (company: Company) => {
    navigate(`/companies/${company.id}`);
  };

  if (companies.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">
          {hasActiveFilters 
            ? 'Aucune entreprise ne correspond aux filtres actuels.' 
            : 'Aucune entreprise trouvée.'
          }
        </p>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-primary hover:underline mt-2"
          >
            Effacer les filtres
          </button>
        )}
      </div>
    );
  }

  const virtualizedData = {
    companies: paginatedCompanies,
    onEditCompany,
    onDeleteCompany
  };

  return (
    <div className="space-y-4">
      {useVirtualization && !isMobile ? (
        <VirtualizedList
          height={600}
          itemCount={paginatedCompanies.length}
          itemSize={320}
          itemData={virtualizedData}
          className="border rounded-lg"
        >
          {VirtualizedCompanyCard}
        </VirtualizedList>
      ) : (
        <div className="grid gap-6" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))' }}>
          {paginatedCompanies.map((company) => (
            <div
              key={company.id}
              className="cursor-pointer"
              onClick={(e) => {
                if ((e.target as HTMLElement).closest('button')) return;
                handleCompanyClick(company);
              }}
            >
              <CompanyCard
                company={company}
                onEdit={onEditCompany}
                onDelete={onDeleteCompany}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CompaniesGrid;
