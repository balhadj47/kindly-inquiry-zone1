
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { User } from '@/types/rbac';
import { useRBAC } from '@/contexts/RBACContext';
import UserCardHeader from './card/UserCardHeader';
import UserCardActions from './card/UserCardActions';
import UserCardContact from './card/UserCardContact';
import UserCardLicense from './card/UserCardLicense';
import UserCardStats from './card/UserCardStats';
import UserCardAccount from './card/UserCardAccount';

interface UserCardProps {
  user: User;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
  onChangePassword: (user: User) => void;
}

const UserCard: React.FC<UserCardProps> = ({
  user,
  onEdit,
  onDelete,
  onChangePassword,
}) => {
  const { hasPermission } = useRBAC();
  
  const canUpdateUsers = hasPermission('users:update');
  const canDeleteUsers = hasPermission('users:delete');
  
  const showActions = canUpdateUsers || canDeleteUsers;

  return (
    <Card className="group hover:shadow-lg transition-all duration-200 border hover:border-primary/20 bg-card">
      <UserCardHeader user={user} />
      
      {showActions && (
        <div className="absolute top-4 right-4">
          <UserCardActions
            user={user}
            onEdit={onEdit}
            onDelete={onDelete}
            onChangePassword={onChangePassword}
          />
        </div>
      )}

      <CardContent className="space-y-6">
        <UserCardContact user={user} />
        <UserCardLicense user={user} />
        <UserCardStats user={user} />
        <UserCardAccount user={user} />
      </CardContent>
    </Card>
  );
};

export default UserCard;
