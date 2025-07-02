
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { useRoleData } from '@/hooks/useRoleData';

interface TeamMemberRoleProps {
  roleId: number;
}

const TeamMemberRole: React.FC<TeamMemberRoleProps> = ({ roleId }) => {
  const { roleName, roleColor } = useRoleData(roleId);
  
  return (
    <Badge variant="outline" className="text-xs px-2 py-1 bg-gray-50 text-gray-700 border-gray-200">
      {roleName}
    </Badge>
  );
};

export default TeamMemberRole;
