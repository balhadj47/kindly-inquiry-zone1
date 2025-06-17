
import React from 'react';
import { Calendar } from 'lucide-react';
import { User } from '@/types/rbac';

interface UserCardAccountProps {
  user: User;
}

const UserCardAccount: React.FC<UserCardAccountProps> = ({ user }) => {
  return (
    <div className="space-y-3">
      <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
        Compte
      </h4>
      <div className="flex items-center space-x-3 text-sm">
        <Calendar className="h-4 w-4 text-muted-foreground flex-shrink-0" />
        <span className="text-muted-foreground">
          Créé le {new Date(user.createdAt).toLocaleDateString('fr-FR')}
        </span>
      </div>
    </div>
  );
};

export default UserCardAccount;
