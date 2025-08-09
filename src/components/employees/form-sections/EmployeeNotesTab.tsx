
import React from 'react';
import { User } from '@/types/rbac';
import EmployeeNotesSection from '../notes/EmployeeNotesSection';

interface EmployeeNotesTabProps {
  employee: User;
}

const EmployeeNotesTab: React.FC<EmployeeNotesTabProps> = ({ employee }) => {
  return (
    <div className="space-y-6">
      <EmployeeNotesSection employee={employee} />
    </div>
  );
};

export default EmployeeNotesTab;
