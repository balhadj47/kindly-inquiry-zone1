
import React from 'react';
import { Shield } from 'lucide-react';
import AuthUserCard from './AuthUserCard';

interface AuthUser {
  id: string;
  email: string;
  created_at: string;
  last_sign_in_at: string | null;
  email_confirmed_at: string | null;
  phone: string | null;
  role: string;
  user_metadata: any;
}

interface AuthUsersListProps {
  authUsers: AuthUser[];
  searchTerm: string;
  statusFilter: string;
  onEditUser: (user: AuthUser) => void;
  onDeleteUser: (user: AuthUser) => void;
  canEdit: boolean;
  canDelete: boolean;
  actionLoading: string | null;
}

const AuthUsersList: React.FC<AuthUsersListProps> = ({
  authUsers,
  searchTerm,
  statusFilter,
  onEditUser,
  onDeleteUser,
  canEdit,
  canDelete,
  actionLoading,
}) => {
  const filteredUsers = authUsers.filter(user => {
    const matchesSearch = !searchTerm || 
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.user_metadata?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'confirmed' && user.email_confirmed_at) ||
      (statusFilter === 'pending' && !user.email_confirmed_at);
    
    return matchesSearch && matchesStatus;
  });

  if (filteredUsers.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 mb-4">
          <Shield className="h-16 w-16 mx-auto" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Aucun compte trouvé
        </h3>
        <p className="text-gray-500">
          {searchTerm || statusFilter !== 'all' 
            ? 'Aucun compte ne correspond aux filtres actuels.'
            : 'Aucun compte d\'authentification n\'a été créé pour le moment.'
          }
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {filteredUsers.map(user => (
        <AuthUserCard
          key={user.id}
          user={user}
          onEdit={onEditUser}
          onDelete={onDeleteUser}
          canEdit={canEdit}
          canDelete={canDelete}
          actionLoading={actionLoading}
        />
      ))}
    </div>
  );
};

export default AuthUsersList;
