
import React from 'react';
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
      <div>
        <h3 className="text-lg font-semibold mb-4">Sélection de l'équipe et des rôles</h3>
        <RoleSelectionSection
          userSearchQuery={userSearchQuery}
          setUserSearchQuery={setUserSearchQuery}
          selectedUsersWithRoles={selectedUsersWithRoles}
          onUserRoleSelection={onUserRoleSelection}
        />
      </div>
    </div>
  );
};

export default TeamSelectionStep;
