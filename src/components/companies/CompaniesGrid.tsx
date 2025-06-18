
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Company } from '@/hooks/useCompanies';
import CompanyCard from './CompanyCard';
import VirtualizedList from '@/components/ui/virtualized-list';
import VirtualizedCompanyCard from '@/components/virtualized/VirtualizedCompanyCard';
import { useIsMobile } from '@/hooks/use-mobile';

interface CompaniesGridProps {
  companies: Company[];
  onEditCompany: (company: Company) => void;
  onDeleteCompany: (company: Company) => void;
}

const CompaniesGrid = ({ companies, onEditCompany, onDeleteCompany }: CompaniesGridProps) => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const useVirtualization = companies.length > 20 && !isMobile;

  const handleCompanyClick = (company: Company) => {
    navigate(`/companies/${company.id}`);
  };

  const virtualizedData = {
    companies,
    onEditCompany,
    onDeleteCompany
  };

  if (useVirtualization) {
    return (
      <VirtualizedList
        height={600}
        itemCount={companies.length}
        itemSize={280}
        itemData={virtualizedData}
        className="border rounded-lg"
      >
        {VirtualizedCompanyCard}
      </VirtualizedList>
    );
  }

  return (
    <div className={`grid gap-4 sm:gap-6 ${
      isMobile 
        ? 'grid-cols-1' 
        : 'grid-cols-1 lg:grid-cols-2 xl:grid-cols-3'
    }`}>
      {companies.map((company) => (
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
  );
};

export default CompaniesGrid;
