
import React, { useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Users as UsersIcon } from 'lucide-react';
import { Group } from '@/types/rbac';
import GroupCard from './GroupCard';

interface GroupGridProps {
  groups: Group[];
  users: any[];
  onEditGroup: (group: Group) => void;
  onManagePermissions: (group: Group) => void;
  onDeleteGroup: (group: Group) => void;
}

const GroupGrid: React.FC<GroupGridProps> = ({
  groups,
  users,
  onEditGroup,
  onManagePermissions,
  onDeleteGroup,
}) => {
  // Add comprehensive safety checks
  const safeGroups = useMemo(() => {
    if (!Array.isArray(groups)) {
      console.warn('GroupGrid - groups prop is not an array:', typeof groups);
      return [];
    }
    return groups.filter(group => group && typeof group === 'object' && group.id);
  }, [groups]);

  const safeUsers = useMemo(() => {
    if (!Array.isArray(users)) {
      console.warn('GroupGrid - users prop is not an array:', typeof users);
      return [];
    }
    return users.filter(user => user && typeof user === 'object' && user.id);
  }, [users]);

  // Remove duplicates with proper unique key generation and safer filtering
  const uniqueGroups = useMemo(() => {
    try {
      const seen = new Set();
      return safeGroups.filter(group => {
        if (!group || !group.id || seen.has(group.id)) {
          return false;
        }
        seen.add(group.id);
        return true;
      });
    } catch (error) {
      console.error('Error processing unique groups:', error);
      return [];
    }
  }, [safeGroups]);

  console.log('GroupGrid - Rendering groups:', {
    originalGroupsCount: safeGroups.length,
    uniqueGroupsCount: uniqueGroups.length,
    usersCount: safeUsers.length
  });

  if (uniqueGroups.length === 0) {
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
      {uniqueGroups.map((group) => {
        try {
          const defaultGroupIds = ['admin', 'employee'];
          const isDefaultGroup = defaultGroupIds.includes(group.id);
          const usersInGroup = safeUsers.filter(u => u.groupId === group.id).length;
          const canDelete = !isDefaultGroup && usersInGroup === 0;

          return (
            <GroupCard
              key={`group-${group.id}`} // Prefixed key to ensure uniqueness
              group={group}
              usersInGroup={usersInGroup}
              canDelete={canDelete}
              isDefaultGroup={isDefaultGroup}
              onEdit={onEditGroup}
              onManagePermissions={onManagePermissions}
              onDelete={onDeleteGroup}
            />
          );
        } catch (error) {
          console.error('Error rendering group card for group:', group.id, error);
          return null;
        }
      })}
    </div>
  );
};

export default GroupGrid;
