
import React from 'react';
import { Users } from 'lucide-react';
import { PageHeader } from '@/components/ui/page-header';

interface EmployeesHeaderProps {
  employeesCount: number;
}

const EmployeesHeader: React.FC<EmployeesHeaderProps> = ({ 
  employeesCount 
}) => {
  return (
    <PageHeader
      title="Gestion des Employés"
      subtitle={`${employeesCount} employé${employeesCount !== 1 ? 's' : ''}`}
      icon={Users}
      iconColor="text-green-600"
      iconBgColor="bg-green-100"
    />
  );
};

export default EmployeesHeader;
