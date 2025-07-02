
import React from 'react';
import { Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Trip } from '@/contexts/TripContext';
import { useUsers } from '@/hooks/users';
import TeamMemberRole from './TeamMemberRole';
import { getRoleIcon } from '../utils/roleUtils';

interface MissionTeamProps {
  mission: Trip;
}

const MissionTeam: React.FC<MissionTeamProps> = ({ mission }) => {
  const { data: usersData } = useUsers();
  const users = usersData?.users || [];

  // Function to get user name by ID with proper type handling
  const getUserName = (userId: string) => {
    const user = users.find(u => {
      const userIdStr = u.id.toString();
      return userIdStr === userId;
    });
    return user ? user.name : `User ${userId}`;
  };

  if (!mission.userRoles || mission.userRoles.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6">
      <div className="flex items-center gap-3 mb-6">
        <Users className="h-5 w-5 text-blue-600" />
        <h3 className="text-lg font-semibold text-gray-900">Équipe Assignée</h3>
      </div>
      <div className="space-y-3">
        {mission.userRoles.map((userRole, index) => (
          <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="flex gap-1">
                {userRole.roles.map((role, roleIndex) => {
                  let roleName = '';
                  if (typeof role === 'string') {
                    roleName = role;
                  } else if (typeof role === 'object' && role !== null) {
                    const roleObj = role as any;
                    roleName = roleObj.name || 'Rôle Inconnu';
                  }
                  return (
                    <div key={roleIndex} className="flex items-center gap-1">
                      {getRoleIcon(roleName)}
                    </div>
                  );
                })}
              </div>
              
              <span className="font-medium text-gray-900">
                {getUserName(userRole.userId)}
              </span>
            </div>
            
            <div className="flex flex-wrap gap-1">
              {userRole.roles.map((role, roleIndex) => {
                if (typeof role === 'string') {
                  return (
                    <Badge key={roleIndex} variant="outline" className="text-xs">
                      {role}
                    </Badge>
                  );
                } else if (typeof role === 'object' && role !== null) {
                  const roleObj = role as any;
                  if (roleObj.role_id) {
                    return <TeamMemberRole key={roleIndex} roleId={roleObj.role_id} />;
                  }
                  return (
                    <Badge key={roleIndex} variant="outline" className="text-xs">
                      {roleObj.name || 'Rôle Inconnu'}
                    </Badge>
                  );
                }
                return null;
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MissionTeam;
