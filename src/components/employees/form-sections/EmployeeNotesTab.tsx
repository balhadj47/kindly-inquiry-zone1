
import React from 'react';
import { User } from '@/types/rbac';
import EmployeeNotesSection from '../notes/EmployeeNotesSection';

interface EmployeeNotesTabProps {
  employee: User | null;
}

const EmployeeNotesTab: React.FC<EmployeeNotesTabProps> = ({ employee }) => {
  if (!employee) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>Sauvegardez d'abord l'employé pour ajouter des notes.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <EmployeeNotesSection employee={employee} />
    </div>
  );
};

export default EmployeeNotesTab;
