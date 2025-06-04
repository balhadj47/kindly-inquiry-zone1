
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, User, Phone, Mail, Shield, Users as UsersIcon, Settings } from 'lucide-react';
import { useRBAC } from '@/contexts/RBACContext';
import UserModal from './UserModal';
import GroupModal from './GroupModal';
import GroupPermissionsModal from './GroupPermissionsModal';

const Users = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
  const [isPermissionsModalOpen, setIsPermissionsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState(null);
  
  const { users, groups, getUserGroup, hasPermission } = useRBAC();

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.licenseNumber && user.licenseNumber.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
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

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Users Management</h1>
        <div className="flex space-x-2 mt-4 md:mt-0">
          {hasPermission('users.create') && (
            <Button onClick={handleAddUser}>
              Add New User
            </Button>
          )}
          {hasPermission('users.manage_groups') && (
            <Button variant="outline" onClick={handleAddGroup}>
              Add Group
            </Button>
          )}
        </div>
      </div>

      <Tabs defaultValue="users" className="space-y-4">
        <TabsList>
          <TabsTrigger value="users" className="flex items-center space-x-2">
            <User className="h-4 w-4" />
            <span>Users</span>
          </TabsTrigger>
          {hasPermission('users.manage_groups') && (
            <TabsTrigger value="groups" className="flex items-center space-x-2">
              <UsersIcon className="h-4 w-4" />
              <span>Groups</span>
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="users" className="space-y-4">
          {/* Search Bar */}
          <Card>
            <CardContent className="pt-6">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by name, email, or license number..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardContent>
          </Card>

          {/* Users Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredUsers.map((user) => {
              const userGroup = getUserGroup(user.groupId);
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
                    
                    {user.role === 'Driver' && user.totalTrips && (
                      <div className="text-sm text-gray-600">
                        <p><span className="font-medium">Total Trips:</span> {user.totalTrips}</p>
                        <p><span className="font-medium">Last Trip:</span> {user.lastTrip}</p>
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
                          Edit
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                      >
                        View History
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {hasPermission('users.manage_groups') && (
          <TabsContent value="groups" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {groups.map((group) => (
                <Card key={group.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{group.name}</CardTitle>
                        <p className="text-sm text-gray-600">{group.description}</p>
                      </div>
                      <Badge className={group.color}>
                        {users.filter(u => u.groupId === group.id).length} users
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-sm text-gray-600">
                      <p><span className="font-medium">Permissions:</span> {group.permissions.length}</p>
                    </div>
                    
                    <div className="flex space-x-2 pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditGroup(group)}
                        className="flex-1"
                      >
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleManagePermissions(group)}
                        className="flex-1"
                      >
                        <Settings className="h-4 w-4 mr-1" />
                        Permissions
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
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
