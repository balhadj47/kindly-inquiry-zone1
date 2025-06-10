
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Users as UsersIcon } from 'lucide-react';
import { UserGroup } from '@/types/rbac';
import GroupCard from './GroupCard';

interface GroupGridProps {
  groups: UserGroup[];
  users: any[];
  onEditGroup: (group: UserGroup) => void;
  onManagePermissions: (group: UserGroup) => void;
  onDeleteGroup: (group: UserGroup) => void;
}

const GroupGrid: React.FC<GroupGridProps> = ({
  groups,
  users,
  onEditGroup,
  onManagePermissions,
  onDeleteGroup,
}) => {
  if (!groups || groups.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <UsersIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun groupe trouvé</h3>
          <p className="text-gray-500">Créez votre premier groupe d'utilisateurs pour commencer.</p>
        </CardContent>
      </Card>
    );
  }

  // Remove duplicates based on group ID with proper unique key generation
  const uniqueGroups = groups.reduce((acc, group) => {
    const existingGroupIndex = acc.findIndex(g => g.id === group.id);
    if (existingGroupIndex === -1) {
      acc.push(group);
    }
    return acc;
  }, [] as UserGroup[]);

  console.log('GroupGrid - Rendering groups:', uniqueGroups.length);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {uniqueGroups.map((group) => {
        const defaultGroupIds = ['admin', 'employee'];
        const isDefaultGroup = defaultGroupIds.includes(group.id);
        const usersInGroup = users ? users.filter(u => u.groupId === group.id).length : 0;
        const canDelete = !isDefaultGroup && usersInGroup === 0;

        return (
          <GroupCard
            key={group.id} // Use only group.id as key since we've ensured uniqueness
            group={group}
            usersInGroup={usersInGroup}
            canDelete={canDelete}
            isDefaultGroup={isDefaultGroup}
            onEdit={onEditGroup}
            onManagePermissions={onManagePermissions}
            onDelete={onDeleteGroup}
          />
        );
      })}
    </div>
  );
};

export default GroupGrid;
