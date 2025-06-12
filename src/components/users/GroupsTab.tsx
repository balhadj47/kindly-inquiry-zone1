
import React from 'react';
import { TabsContent } from '@/components/ui/tabs';
import { Group } from '@/types/rbac';
import GroupGrid from './GroupGrid';

interface GroupsTabProps {
  groups: Group[];
  users: any[];
  onEditGroup: (group: Group) => void;
  onManagePermissions: (group: Group) => void;
  onDeleteGroup: (group: Group) => void;
}

const GroupsTab: React.FC<GroupsTabProps> = ({
  groups,
  users,
  onEditGroup,
  onManagePermissions,
  onDeleteGroup,
}) => {
  return (
    <TabsContent value="groups" className="space-y-4">
      <GroupGrid
        groups={groups}
        users={users}
        onEditGroup={onEditGroup}
        onManagePermissions={onManagePermissions}
        onDeleteGroup={onDeleteGroup}
      />
    </TabsContent>
  );
};

export default GroupsTab;
