
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, User, Shield } from 'lucide-react';
import { type Trip } from '@/contexts/TripContext';
import { useIsMobile } from '@/hooks/use-mobile';

interface TripTeamProps {
  trip: Trip;
  users: any[];
}

const TripTeam: React.FC<TripTeamProps> = ({ trip, users }) => {
  const isMobile = useIsMobile();

  const getAssignedUsersWithRoles = () => {
    if (trip.userRoles && trip.userRoles.length > 0) {
      return trip.userRoles.map(userWithRole => {
        const user = users.find(u => u.id.toString() === userWithRole.userId);
        return {
          user: user || { id: userWithRole.userId, name: `User ${userWithRole.userId}`, role: 'Unknown' },
          missionRoles: userWithRole.roles
        };
      });
    }

    if (trip.userIds && trip.userIds.length > 0) {
      return trip.userIds.map(userId => {
        const user = users.find(u => u.id.toString() === userId);
        return {
          user: user || { id: userId, name: `User ${userId}`, role: 'Unknown' },
          missionRoles: []
        };
      });
    }

    return [];
  };

  const assignedUsersWithRoles = getAssignedUsersWithRoles();

  return (
    <Card>
      <CardContent className={isMobile ? 'p-3' : 'p-4'}>
        <h3 className={`${isMobile ? 'text-base' : 'text-lg'} font-semibold mb-3 flex items-center`}>
          <Users className={`${isMobile ? 'h-4 w-4' : 'h-5 w-5'} mr-2 text-emerald-600`} />
          Équipe Assignée ({assignedUsersWithRoles.length} personnes)
        </h3>
        
        {assignedUsersWithRoles.length === 0 ? (
          <p className={`${isMobile ? 'text-sm' : ''} text-gray-500 italic`}>Aucun membre d'équipe assigné</p>
        ) : (
          <div className={`space-y-2 ${isMobile ? 'space-y-2' : 'space-y-3'}`}>
            {assignedUsersWithRoles.map((userWithRoles, index) => (
              <div key={userWithRoles.user.id || index} className={`flex items-center justify-between p-2 ${isMobile ? 'p-2' : 'p-3'} bg-gray-50 rounded-lg`}>
                <div className="flex items-center space-x-3">
                  <User className={`${isMobile ? 'h-3 w-3' : 'h-4 w-4'} text-gray-600`} />
                  <div>
                    <p className={`${isMobile ? 'text-xs' : 'text-sm'} font-medium`}>{userWithRoles.user.name}</p>
                    <div className={`flex flex-wrap gap-1 ${isMobile ? 'mt-0.5' : 'mt-1'}`}>
                      <Badge variant="secondary" className={isMobile ? 'text-xs px-1 py-0' : 'text-xs'}>
                        {userWithRoles.user.role}
                      </Badge>
                      {userWithRoles.missionRoles.map((missionRole, roleIndex) => (
                        <Badge key={roleIndex} variant="outline" className={isMobile ? 'text-xs px-1 py-0' : 'text-xs'}>
                          {missionRole}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                {(userWithRoles.missionRoles.includes('Armé') || userWithRoles.missionRoles.includes('Chef de Groupe')) && (
                  <Shield className={`${isMobile ? 'h-3 w-3' : 'h-4 w-4'} text-red-500`} />
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TripTeam;
