
import React from 'react';
import { Company } from '@/hooks/useCompanies';
import CompanyCard from './CompanyCard';

interface CompaniesGridProps {
  companies: Company[];
  onEditCompany: (company: Company) => void;
  onDeleteCompany: (company: Company) => void;
}

const CompaniesGrid = ({ companies, onEditCompany, onDeleteCompany }: CompaniesGridProps) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
      {companies.map((company) => (
        <CompanyCard
          key={company.id}
          company={company}
          onEdit={onEditCompany}
          onDelete={onDeleteCompany}
        />
      ))}
    </div>
  );
};

export default CompaniesGrid;
