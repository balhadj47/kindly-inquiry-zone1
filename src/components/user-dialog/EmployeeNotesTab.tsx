
import React from 'react';
import { User } from '@/types/rbac';
import EmployeeNotesSection from '../employees/notes/EmployeeNotesSection';

interface EmployeeNotesTabProps {
  user: User;
}

const EmployeeNotesTab: React.FC<EmployeeNotesTabProps> = ({ user }) => {
  return (
    <div className="space-y-4">
      <EmployeeNotesSection employee={user} />
    </div>
  );
};

export default EmployeeNotesTab;
