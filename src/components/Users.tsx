import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, User, Phone, Mail, Shield, Users as UsersIcon, Settings, Loader2, Trash2, Filter, X } from 'lucide-react';
import { useRBAC } from '@/contexts/RBACContext';
import { useLanguage } from '@/contexts/LanguageContext';
import UserModal from './UserModal';
import GroupModal from './GroupModal';
import GroupPermissionsModal from './GroupPermissionsModal';

const Users = () => {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');
  const [groupFilter, setGroupFilter] = useState('all');
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
  const [isPermissionsModalOpen, setIsPermissionsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState(null);
  
  const { users, groups, getUserGroup, hasPermission, loading, deleteGroup, deleteUser, currentUser } = useRBAC();

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setRoleFilter('all');
    setGroupFilter('all');
  };

  const hasActiveFilters = searchTerm || statusFilter !== 'all' || roleFilter !== 'all' || groupFilter !== 'all';

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.licenseNumber && user.licenseNumber.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesGroup = groupFilter === 'all' || user.groupId === groupFilter;

    return matchesSearch && matchesStatus && matchesRole && matchesGroup;
  });

  // Get unique statuses and roles from users
  const uniqueStatuses = [...new Set(users.map(user => user.status))];
  const uniqueRoles = [...new Set(users.map(user => user.role))];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Récupération': return 'bg-yellow-100 text-yellow-800';
      case 'Congé': return 'bg-blue-100 text-blue-800';
      case 'Congé maladie': return 'bg-red-100 text-red-800';
      // Legacy support for English statuses
      case 'Inactive': return 'bg-gray-100 text-gray-800';
      case 'Suspended': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleAddUser = () => {
    setSelectedUser(null);
    setIsUserModalOpen(true);
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setIsUserModalOpen(true);
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
    // Check if any users are assigned to this group
    const usersInGroup = users.filter(user => user.groupId === group.id);
    
    if (usersInGroup.length > 0) {
      alert(`Impossible de supprimer le groupe "${group.name}" car ${usersInGroup.length} utilisateur(s) y sont assignés. Veuillez d'abord réassigner ces utilisateurs à un autre groupe.`);
      return;
    }

    // Prevent deletion of default groups
    const defaultGroupIds = ['admin', 'employee', 'chef_groupe_arme', 'chef_groupe_sans_arme', 'chauffeur_arme', 'chauffeur_sans_arme', 'aps_arme', 'aps_sans_arme'];
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
        <span className="ml-2">{t.loadingUsers}</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <h1 className="text-3xl font-bold text-gray-900">{t.usersManagement}</h1>
        <div className="flex space-x-2 mt-4 md:mt-0">
          {hasPermission('users.create') && (
            <Button onClick={handleAddUser}>
              {t.addNewUser}
            </Button>
          )}
          {hasPermission('users.manage_groups') && (
            <Button variant="outline" onClick={handleAddGroup}>
              {t.addGroup}
            </Button>
          )}
        </div>
      </div>

      <Tabs defaultValue="users" className="space-y-4">
        <TabsList>
          <TabsTrigger value="users" className="flex items-center space-x-2">
            <User className="h-4 w-4" />
            <span>{t.users}</span>
          </TabsTrigger>
          {hasPermission('users.manage_groups') && (
            <TabsTrigger value="groups" className="flex items-center space-x-2">
              <UsersIcon className="h-4 w-4" />
              <span>{t.groups}</span>
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="users" className="space-y-4">
          {/* Search and Filters */}
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {/* Search Bar */}
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder={t.searchByNameEmailLicense}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                {/* Filter Row */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue placeholder={t.filterByStatus} />
                    </SelectTrigger>
                    <SelectContent className="bg-background border shadow-lg z-50">
                      <SelectItem value="all">{t.allStatuses}</SelectItem>
                      {uniqueStatuses.map(status => (
                        <SelectItem key={status} value={status}>{status}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={roleFilter} onValueChange={setRoleFilter}>
                    <SelectTrigger>
                      <Shield className="h-4 w-4 mr-2" />
                      <SelectValue placeholder={t.filterByRole} />
                    </SelectTrigger>
                    <SelectContent className="bg-background border shadow-lg z-50">
                      <SelectItem value="all">{t.allRoles}</SelectItem>
                      {uniqueRoles.map(role => (
                        <SelectItem key={role} value={role}>{role}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={groupFilter} onValueChange={setGroupFilter}>
                    <SelectTrigger>
                      <UsersIcon className="h-4 w-4 mr-2" />
                      <SelectValue placeholder={t.filterByGroup} />
                    </SelectTrigger>
                    <SelectContent className="bg-background border shadow-lg z-50">
                      <SelectItem value="all">{t.allGroups}</SelectItem>
                      {groups.map(group => (
                        <SelectItem key={group.id} value={group.id}>{group.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {hasActiveFilters && (
                    <Button variant="outline" onClick={clearFilters} className="flex items-center space-x-2">
                      <X className="h-4 w-4" />
                      <span>{t.clearFilters}</span>
                    </Button>
                  )}
                </div>

                {/* Results Summary */}
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>
                    {t.showingUsers} {filteredUsers.length} {t.of} {users.length} {t.users.toLowerCase()}
                    {hasActiveFilters && ` ${t.filtered}`}
                  </span>
                  {hasActiveFilters && (
                    <div className="flex items-center space-x-2">
                      <span>{t.activeFilters}</span>
                      {searchTerm && <Badge variant="secondary">{t.search}: "{searchTerm}"</Badge>}
                      {statusFilter !== 'all' && <Badge variant="secondary">Status: {statusFilter}</Badge>}
                      {roleFilter !== 'all' && <Badge variant="secondary">Role: {roleFilter}</Badge>}
                      {groupFilter !== 'all' && <Badge variant="secondary">Group: {groups.find(g => g.id === groupFilter)?.name}</Badge>}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Users Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredUsers.map((user) => {
              const userGroup = getUserGroup(user.groupId);
              const canDeleteThisUser = hasPermission('users.delete') && currentUser?.id !== user.id;
              
              return (
                <Card key={user.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{user.name}</CardTitle>
                        <p className="text-sm text-gray-600">{user.role}</p>
                        {user.licenseNumber && (
                          <p className="text-xs text-gray-500">{user.licenseNumber}</p>
                        )}
                      </div>
                      <div className="flex flex-col space-y-1">
                        <Badge className={getStatusColor(user.status)}>
                          {user.status}
                        </Badge>
                        {userGroup && (
                          <Badge className={userGroup.color}>
                            {userGroup.name}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Phone className="h-4 w-4 text-gray-500" />
                        <span className="text-sm">{user.phone}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Mail className="h-4 w-4 text-gray-500" />
                        <span className="text-sm">{user.email}</span>
                      </div>
                    </div>
                    
                    {(user.role === 'Chauffeur Armé' || user.role === 'Chauffeur Sans Armé') && user.totalTrips && (
                      <div className="text-sm text-gray-600">
                        <p><span className="font-medium">{t.totalTripsLabel}</span> {user.totalTrips}</p>
                        <p><span className="font-medium">{t.lastTripLabel}</span> {user.lastTrip}</p>
                      </div>
                    )}
                    
                    <div className="flex space-x-2 pt-2">
                      {hasPermission('users.edit') && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditUser(user)}
                          className="flex-1"
                        >
                          {t.edit}
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                      >
                        {t.viewHistory}
                      </Button>
                      {canDeleteThisUser && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteUser(user)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {filteredUsers.length === 0 && (
            <Card>
              <CardContent className="text-center py-8">
                <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">{t.noUsersFound}</h3>
                <p className="text-gray-500">
                  {hasActiveFilters 
                    ? t.tryAdjustingFilters 
                    : t.tryAdjustingSearch
                  }
                </p>
                {hasActiveFilters && (
                  <Button variant="outline" onClick={clearFilters} className="mt-4">
                    {t.clearAllFilters}
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {hasPermission('users.manage_groups') && (
          <TabsContent value="groups" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {groups.map((group) => {
                const defaultGroupIds = ['admin', 'employee', 'chef_groupe_arme', 'chef_groupe_sans_arme', 'chauffeur_arme', 'chauffeur_sans_arme', 'aps_arme', 'aps_sans_arme'];
                const isDefaultGroup = defaultGroupIds.includes(group.id);
                const usersInGroup = users.filter(u => u.groupId === group.id).length;
                const canDelete = !isDefaultGroup && usersInGroup === 0;

                return (
                  <Card key={group.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">{group.name}</CardTitle>
                          <p className="text-sm text-gray-600">{group.description}</p>
                        </div>
                        <Badge className={group.color}>
                          {usersInGroup} {t.users.toLowerCase()}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="text-sm text-gray-600">
                        <p><span className="font-medium">{t.permissions}:</span> {group.permissions.length}</p>
                      </div>
                      
                      <div className="flex space-x-2 pt-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditGroup(group)}
                          className="flex-1"
                        >
                          {t.edit}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleManagePermissions(group)}
                          className="flex-1"
                        >
                          <Settings className="h-4 w-4 mr-1" />
                          {t.permissions}
                        </Button>
                        {canDelete && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteGroup(group)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                      
                      {!canDelete && (
                        <p className="text-xs text-gray-500 mt-2">
                          {isDefaultGroup 
                            ? "Groupe par défaut - Ne peut pas être supprimé"
                            : `Impossible de supprimer - ${usersInGroup} utilisateur(s) assigné(s)`
                          }
                        </p>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {groups.length === 0 && (
              <Card>
                <CardContent className="text-center py-8">
                  <UsersIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">{t.noGroupsFound}</h3>
                  <p className="text-gray-500">{t.createFirstGroup}</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
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
    </div>
  );
};

export default Users;
