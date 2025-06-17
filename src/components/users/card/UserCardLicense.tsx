
import React from 'react';
import { MapPin } from 'lucide-react';
import { User } from '@/types/rbac';

interface UserCardLicenseProps {
  user: User;
}

const UserCardLicense: React.FC<UserCardLicenseProps> = ({ user }) => {
  if (!user.licenseNumber) {
    return null;
  }

  return (
    <div className="space-y-3">
      <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
        Licence
      </h4>
      <div className="flex items-center space-x-3 text-sm">
        <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
        <span className="font-mono text-xs bg-muted px-2 py-1 rounded">
          {user.licenseNumber}
        </span>
      </div>
    </div>
  );
};

export default UserCardLicense;
