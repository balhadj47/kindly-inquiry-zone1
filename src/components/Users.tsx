
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, Users as UsersIcon, Loader2, AlertTriangle, Key } from 'lucide-react';
import { useRBAC } from '@/contexts/RBACContext';
import { useAuth } from '@/contexts/AuthContext';
import UserModal from './UserModal';
import GroupModal from './GroupModal';
import GroupPermissionsModal from './GroupPermissionsModal';
import PasswordChangeModal from './PasswordChangeModal';
import UsersTab from './users/UsersTab';
import GroupsTab from './users/GroupsTab';
import { Card, CardContent } from '@/components/ui/card';

const Users = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');
  const [groupFilter, setGroupFilter] = useState('all');
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
  const [isPermissionsModalOpen, setIsPermissionsModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState(null);
  
  const { users, groups, hasPermission, loading, deleteGroup, deleteUser, currentUser } = useRBAC();
  const { user: authUser } = useAuth();

  // Debug permissions
  console.log('Users component - hasPermission check results:');
  console.log('users.view:', hasPermission('users.view'));
  console.log('users.create:', hasPermission('users.create'));
  console.log('users.manage_groups:', hasPermission('users.manage_groups'));
  console.log('Current user:', currentUser);
  console.log('Auth user:', authUser);
  console.log('Current user group:', currentUser?.groupId);
  console.log('Available groups:', groups);

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setRoleFilter('all');
    setGroupFilter('all');
  };

  const hasActiveFilters = searchTerm !== '' || statusFilter !== 'all' || roleFilter !== 'all' || groupFilter !== 'all';

  const handleAddUser = () => {
    setSelectedUser(null);
    setIsUserModalOpen(true);
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setIsUserModalOpen(true);
  };

  const handleChangePassword = (user) => {
    setSelectedUser(user);
    setIsPasswordModalOpen(true);
  };

  const handleDeleteUser = async (user) => {
    if (currentUser && currentUser.id === user.id) {
      alert("Vous ne pouvez pas supprimer votre propre compte.");
      return;
    }

    if (confirm(`Êtes-vous sûr de vouloir supprimer l'utilisateur "${user.name}" ? Cette action ne peut pas être annulée.`)) {
      await deleteUser(user.id);
    }
  };

  const handleAddGroup = () => {
    setSelectedGroup(null);
    setIsGroupModalOpen(true);
  };

  const handleEditGroup = (group) => {
    setSelectedGroup(group);
    setIsGroupModalOpen(true);
  };

  const handleManagePermissions = (group) => {
    setSelectedGroup(group);
    setIsPermissionsModalOpen(true);
  };

  const handleDeleteGroup = async (group) => {
    const usersInGroup = users.filter(user => user.groupId === group.id);
    
    if (usersInGroup.length > 0) {
      alert(`Impossible de supprimer le groupe "${group.name}" car ${usersInGroup.length} utilisateur(s) y sont assignés. Veuillez d'abord réassigner ces utilisateurs à un autre groupe.`);
      return;
    }

    const defaultGroupIds = ['admin', 'employee'];
    if (defaultGroupIds.includes(group.id)) {
      alert(`Impossible de supprimer le groupe par défaut "${group.name}".`);
      return;
    }

    if (confirm(`Êtes-vous sûr de vouloir supprimer le groupe "${group.name}" ? Cette action ne peut pas être annulée.`)) {
      await deleteGroup(group.id);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Chargement des utilisateurs...</span>
      </div>
    );
  }

  // Show message if user is not authenticated
  if (!authUser) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Gestion des Utilisateurs</h1>
        <Card>
          <CardContent className="text-center py-12">
            <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Authentification requise</h3>
            <p className="text-gray-600">
              Vous devez être connecté pour accéder à la gestion des utilisateurs.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show message if current user data is not found
  if (!currentUser) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Gestion des Utilisateurs</h1>
        <Card>
          <CardContent className="text-center py-12">
            <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Profil utilisateur introuvable</h3>
            <p className="text-gray-600">
              Votre profil utilisateur n'a pas été trouvé dans le système. Veuillez contacter un administrateur.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const canManageGroups = hasPermission('users.manage_groups');
  console.log('Can manage groups:', canManageGroups);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Gestion des Utilisateurs</h1>
        <div className="flex space-x-2 mt-4 md:mt-0">
          {hasPermission('users.create') && (
            <Button onClick={handleAddUser}>
              Ajouter un Nouvel Utilisateur
            </Button>
          )}
          {canManageGroups && (
            <Button variant="outline" onClick={handleAddGroup}>
              Ajouter un Groupe
            </Button>
          )}
        </div>
      </div>

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

        <UsersTab
          users={users}
          groups={groups}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          roleFilter={roleFilter}
          setRoleFilter={setRoleFilter}
          groupFilter={groupFilter}
          setGroupFilter={setGroupFilter}
          clearFilters={clearFilters}
          hasActiveFilters={hasActiveFilters}
          onEditUser={handleEditUser}
          onDeleteUser={handleDeleteUser}
          onChangePassword={handleChangePassword}
        />

        {canManageGroups && (
          <GroupsTab
            groups={groups}
            users={users}
            onEditGroup={handleEditGroup}
            onManagePermissions={handleManagePermissions}
            onDeleteGroup={handleDeleteGroup}
          />
        )}
      </Tabs>

      <UserModal
        isOpen={isUserModalOpen}
        onClose={() => setIsUserModalOpen(false)}
        user={selectedUser}
      />

      <GroupModal
        isOpen={isGroupModalOpen}
        onClose={() => setIsGroupModalOpen(false)}
        group={selectedGroup}
      />

      <GroupPermissionsModal
        isOpen={isPermissionsModalOpen}
        onClose={() => setIsPermissionsModalOpen(false)}
        group={selectedGroup}
      />

      <PasswordChangeModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        user={selectedUser}
      />
    </div>
  );
};

export default Users;
