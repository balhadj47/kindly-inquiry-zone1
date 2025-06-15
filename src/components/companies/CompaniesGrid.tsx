
import React from 'react';
import { Company } from '@/hooks/useCompanies';
import CompanyCard from './CompanyCard';

interface CompaniesGridProps {
  companies: Company[];
  onEditCompany: (company: Company) => void;
  onDeleteCompany: (company: Company) => void;
  onShowCompanyDetail: (company: Company) => void;
}

const CompaniesGrid = ({ companies, onEditCompany, onDeleteCompany, onShowCompanyDetail }: CompaniesGridProps) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
      {companies.map((company) => (
        <div
          key={company.id}
          className="cursor-pointer"
          onClick={(e) => {
            // Don't trigger details on edit/delete
            if ((e.target as HTMLElement).closest('button')) return;
            onShowCompanyDetail(company);
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

