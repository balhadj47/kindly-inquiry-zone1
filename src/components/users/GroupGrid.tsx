
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
  if (groups.length === 0) {
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

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {groups.map((group) => {
        const defaultGroupIds = ['admin', 'employee'];
        const isDefaultGroup = defaultGroupIds.includes(group.id);
        const usersInGroup = users.filter(u => u.groupId === group.id).length;
        const canDelete = !isDefaultGroup && usersInGroup === 0;

        return (
          <GroupCard
            key={group.id}
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
