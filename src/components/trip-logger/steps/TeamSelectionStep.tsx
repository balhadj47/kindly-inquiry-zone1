
import React from 'react';
import { Users } from 'lucide-react';
import RoleSelectionSection from '../../RoleSelectionSection';
import { UserWithRoles } from '@/hooks/useTripForm';
import { MissionRole } from '@/types/missionRoles';

interface TeamSelectionStepProps {
  userSearchQuery: string;
  setUserSearchQuery: (query: string) => void;
  selectedUsersWithRoles: UserWithRoles[];
  onUserRoleSelection: (userId: string, roles: MissionRole[]) => void;
}

const TeamSelectionStep: React.FC<TeamSelectionStepProps> = ({
  userSearchQuery,
  setUserSearchQuery,
  selectedUsersWithRoles,
  onUserRoleSelection
}) => {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
          <Users className="w-8 h-8 text-green-600" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Sélection de l'équipe</h3>
        <p className="text-gray-600">Ajoutez les membres de l'équipe et assignez leurs rôles</p>
      </div>

      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <RoleSelectionSection
          userSearchQuery={userSearchQuery}
          setUserSearchQuery={setUserSearchQuery}
          selectedUsersWithRoles={selectedUsersWithRoles}
          onUserRoleSelection={onUserRoleSelection}
          filterByRole="Employee"
        />
      </div>
    </div>
  );
};

export default TeamSelectionStep;
