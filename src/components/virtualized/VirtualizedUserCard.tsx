
import React from 'react';
import { User } from '@/types/rbac';
import UserCard from '../users/UserCard';

interface VirtualizedUserCardProps {
  index: number;
  style: React.CSSProperties;
  data: {
    users: User[];
    onEditUser: (user: User) => void;
    onDeleteUser: (user: User) => void;
    onChangePassword: (user: User) => void;
  };
}

const VirtualizedUserCard: React.FC<VirtualizedUserCardProps> = ({ index, style, data }) => {
  const { users, onEditUser, onDeleteUser, onChangePassword } = data;
  const user = users[index];

  if (!user) return null;

  return (
    <div style={style} className="px-1 py-2">
      <UserCard
        user={user}
        onEdit={onEditUser}
        onDelete={onDeleteUser}
        onChangePassword={onChangePassword}
      />
    </div>
  );
};

export default VirtualizedUserCard;
