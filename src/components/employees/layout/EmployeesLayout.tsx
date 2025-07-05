
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import EmployeesHeader from '../EmployeesHeader';
import EmployeesActions from '../EmployeesActions';
import EmployeesFilters from '../EmployeesFilters';
import { User } from '@/types/rbac';

interface EmployeesLayoutProps {
  employeesCount: number;
  canCreateEmployees: boolean;
  onCreateEmployee: () => void;
  onRefresh: () => void;
  isRefreshing?: boolean;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  statusFilter: string;
  setStatusFilter: (filter: string) => void;
  clearFilters: () => void;
  employees: User[];
  children: React.ReactNode;
}

const EmployeesLayout: React.FC<EmployeesLayoutProps> = ({
  employeesCount,
  canCreateEmployees,
  onCreateEmployee,
  onRefresh,
  isRefreshing = false,
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  clearFilters,
  employees,
  children
}) => {
  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Fixed Header and Filters Section */}
      <div className="flex-shrink-0 space-y-6 pb-6">
        {/* Header section */}
        <div className="flex items-center justify-between">
          <EmployeesHeader employeesCount={employeesCount} />
          <EmployeesActions 
            onCreateEmployee={onCreateEmployee}
            onRefresh={onRefresh}
            isRefreshing={isRefreshing}
            canCreateEmployees={canCreateEmployees}
          />
        </div>

        {/* Filters section */}
        <Card className="shadow-sm border-border/20">
          <CardContent className="p-6">
            <EmployeesFilters
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
              clearFilters={clearFilters}
              employees={employees}
            />
          </CardContent>
        </Card>
      </div>

      {/* Scrollable Content Area - Only this part scrolls */}
      <div className="flex-1 min-h-0 overflow-hidden">
        <div className="h-full overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

export default EmployeesLayout;
