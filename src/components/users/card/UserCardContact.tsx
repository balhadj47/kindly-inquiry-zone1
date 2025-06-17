
import React from 'react';
import { Phone, Mail } from 'lucide-react';
import { User } from '@/types/rbac';

interface UserCardContactProps {
  user: User;
}

const UserCardContact: React.FC<UserCardContactProps> = ({ user }) => {
  return (
    <div className="space-y-3">
      <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
        Contact
      </h4>
      <div className="space-y-2">
        <div className="flex items-center space-x-3 text-sm">
          <Mail className="h-4 w-4 text-muted-foreground flex-shrink-0" />
          <span className="truncate">{user.email}</span>
        </div>
        <div className="flex items-center space-x-3 text-sm">
          <Phone className="h-4 w-4 text-muted-foreground flex-shrink-0" />
          <span>{user.phone}</span>
        </div>
      </div>
    </div>
  );
};

export default UserCardContact;
