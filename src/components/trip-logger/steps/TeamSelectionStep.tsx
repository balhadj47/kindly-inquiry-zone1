
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
    <div className="space-y-6">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-3">
          <Users className="w-6 h-6 text-green-600" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">Sélection de l'équipe</h3>
        <p className="text-gray-600">Ajoutez les membres de l'équipe et assignez leurs rôles</p>
      </div>

      <RoleSelectionSection
        userSearchQuery={userSearchQuery}
        setUserSearchQuery={setUserSearchQuery}
        selectedUsersWithRoles={selectedUsersWithRoles}
        onUserRoleSelection={onUserRoleSelection}
        filterByRoleId={3}
      />
    </div>
  );
};

export default TeamSelectionStep;
