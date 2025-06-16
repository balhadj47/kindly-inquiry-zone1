
import React, { useState } from 'react';
import { TabsContent } from '@/components/ui/tabs';
import { Tabs, TabsContent as InnerTabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Group } from '@/types/rbac';
import { useRBAC } from '@/contexts/RBACContext';
import GroupGrid from './GroupGrid';
import PermissionsMatrix from './PermissionsMatrix';

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
  const { permissions } = useRBAC();

  return (
    <TabsContent value="groups" className="space-y-4">
      <Tabs defaultValue="grid" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="grid">Vue Groupes</TabsTrigger>
          <TabsTrigger value="matrix">Matrice Permissions</TabsTrigger>
        </TabsList>
        
        <InnerTabsContent value="grid" className="space-y-4">
          <GroupGrid
            groups={groups}
            users={users}
            onEditGroup={onEditGroup}
            onManagePermissions={onManagePermissions}
            onDeleteGroup={onDeleteGroup}
          />
        </InnerTabsContent>
        
        <InnerTabsContent value="matrix" className="space-y-4">
          <PermissionsMatrix
            groups={groups}
            permissions={permissions}
            onManagePermissions={onManagePermissions}
          />
        </InnerTabsContent>
      </Tabs>
    </TabsContent>
  );
};

export default GroupsTab;
