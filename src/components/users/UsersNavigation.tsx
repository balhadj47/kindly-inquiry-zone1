
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import RolesTab from './RolesTab';

interface UsersNavigationProps {
  canManageGroups: boolean;
  children: React.ReactNode;
}

const UsersNavigation: React.FC<UsersNavigationProps> = ({ 
  canManageGroups, 
  children 
}) => {
  return (
    <Tabs defaultValue="users" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="users">Utilisateurs</TabsTrigger>
        {canManageGroups && (
          <TabsTrigger value="roles">Groupes Système</TabsTrigger>
        )}
      </TabsList>
      
      {/* Users Tab Content */}
      <div className="mt-6">
        {children}
      </div>
      
      {/* Roles Tab Content */}
      {canManageGroups && <RolesTab />}
    </Tabs>
  );
};

export default UsersNavigation;
