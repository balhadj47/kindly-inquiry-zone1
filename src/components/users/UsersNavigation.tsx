
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, Users as UsersIcon } from 'lucide-react';
import GroupsTab from './GroupsTab';

interface UsersNavigationProps {
  canManageGroups: boolean;
  children: React.ReactNode;
}

const UsersNavigation: React.FC<UsersNavigationProps> = ({ canManageGroups, children }) => {
  return (
    <Tabs defaultValue="users" className="space-y-4">
      <TabsList>
        <TabsTrigger value="users" className="flex items-center space-x-2">
          <User className="h-4 w-4" />
          <span>Utilisateurs</span>
        </TabsTrigger>
        {canManageGroups && (
          <TabsTrigger value="groups" className="flex items-center space-x-2">
            <UsersIcon className="h-4 w-4" />
            <span>Groupes</span>
          </TabsTrigger>
        )}
      </TabsList>
      {children}
      {canManageGroups && <GroupsTab />}
    </Tabs>
  );
};

export default UsersNavigation;
