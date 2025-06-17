
import React from 'react';
import { Truck, Clock } from 'lucide-react';
import { User } from '@/types/rbac';

interface UserCardStatsProps {
  user: User;
}

const UserCardStats: React.FC<UserCardStatsProps> = ({ user }) => {
  // Check if user has driver-related license (indicating they might be a driver)
  const isDriver = user.licenseNumber && user.licenseNumber.length > 0;

  if (!isDriver || !user.totalTrips) {
    return null;
  }

  return (
    <div className="space-y-3">
      <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
        Statistiques
      </h4>
      <div className="grid grid-cols-1 gap-3">
        <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
          <div className="flex items-center space-x-2">
            <Truck className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Total Voyages</span>
          </div>
          <span className="text-lg font-bold text-primary">{user.totalTrips}</span>
        </div>
        {user.lastTrip && (
          <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Dernier Voyage</span>
            </div>
            <span className="text-sm text-muted-foreground">{user.lastTrip}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserCardStats;
