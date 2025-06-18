
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Company } from '@/hooks/useCompanies';
import CompanyCard from '../companies/CompanyCard';

interface VirtualizedCompanyCardProps {
  index: number;
  style: React.CSSProperties;
  data: {
    companies: Company[];
    onEditCompany: (company: Company) => void;
    onDeleteCompany: (company: Company) => void;
  };
}

const VirtualizedCompanyCard: React.FC<VirtualizedCompanyCardProps> = ({ index, style, data }) => {
  const navigate = useNavigate();
  const { companies, onEditCompany, onDeleteCompany } = data;
  const company = companies[index];

  if (!company) return null;

  const handleCompanyClick = (company: Company) => {
    navigate(`/companies/${company.id}`);
  };

  return (
    <div style={style} className="px-1 py-2">
      <div
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
    </div>
  );
};

export default VirtualizedCompanyCard;
