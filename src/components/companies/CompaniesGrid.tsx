
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Company } from '@/hooks/useCompanies';
import CompanyCard from './CompanyCard';
import VirtualizedList from '@/components/ui/virtualized-list';
import VirtualizedCompanyCard from '@/components/virtualized/VirtualizedCompanyCard';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

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

      {totalPages > 1 && (
        <div className="flex justify-center pt-4">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage > 1) {
                      onPageChange(currentPage - 1);
                    }
                  }}
                  className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                />
              </PaginationItem>
              
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNumber = i + 1;
                if (totalPages <= 5) {
                  return (
                    <PaginationItem key={pageNumber}>
                      <PaginationLink
                        href="#"
                        isActive={currentPage === pageNumber}
                        onClick={(e) => {
                          e.preventDefault();
                          onPageChange(pageNumber);
                        }}
                        className="cursor-pointer"
                      >
                        {pageNumber}
                      </PaginationLink>
                    </PaginationItem>
                  );
                }
                
                const start = Math.max(1, currentPage - 2);
                const end = Math.min(totalPages, start + 4);
                
                if (pageNumber === 1 && start > 1) {
                  return (
                    <PaginationItem key={pageNumber}>
                      <PaginationLink
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          onPageChange(1);
                        }}
                        className="cursor-pointer"
                      >
                        1
                      </PaginationLink>
                    </PaginationItem>
                  );
                }
                
                if (pageNumber === 2 && start > 2) {
                  return <PaginationEllipsis key="start-ellipsis" />;
                }
                
                if (pageNumber >= start && pageNumber <= end) {
                  return (
                    <PaginationItem key={pageNumber}>
                      <PaginationLink
                        href="#"
                        isActive={currentPage === pageNumber}
                        onClick={(e) => {
                          e.preventDefault();
                          onPageChange(pageNumber);
                        }}
                        className="cursor-pointer"
                      >
                        {pageNumber}
                      </PaginationLink>
                    </PaginationItem>
                  );
                }
                
                if (pageNumber === totalPages - 1 && end < totalPages - 1) {
                  return <PaginationEllipsis key="end-ellipsis" />;
                }
                
                if (pageNumber === totalPages && end < totalPages) {
                  return (
                    <PaginationItem key={pageNumber}>
                      <PaginationLink
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          onPageChange(totalPages);
                        }}
                        className="cursor-pointer"
                      >
                        {totalPages}
                      </PaginationLink>
                    </PaginationItem>
                  );
                }
                
                return null;
              })}
              
              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage < totalPages) {
                      onPageChange(currentPage + 1);
                    }
                  }}
                  className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
};

export default CompaniesGrid;
