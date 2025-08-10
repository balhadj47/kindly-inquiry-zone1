
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
} from '@/components/ui/dialog';
import { Trip } from '@/contexts/TripContext';
import { useVans } from '@/hooks/useVansOptimized';
import { useUsers } from '@/hooks/users';
import MissionHeader from './components/MissionHeader';
import MissionOverview from './components/MissionOverview';
import MissionTimeline from './components/MissionTimeline';
import MissionDestination from './components/MissionDestination';
import MissionNotes from './components/MissionNotes';
import MissionTeam from './components/MissionTeam';
import MissionCompanies from './components/MissionCompanies';
import MissionActions from './components/MissionActions';

interface MissionDetailsDialogProps {
  mission: Trip | null;
  isOpen: boolean;
  onClose: () => void;
  getVanDisplayName: (vanId: string) => string;
}

const MissionDetailsDialog: React.FC<MissionDetailsDialogProps> = ({
  mission,
  isOpen,
  onClose,
  getVanDisplayName,
}) => {
  const { data: vans = [] } = useVans();
  const { data: usersData } = useUsers();
  const users = usersData?.users || [];
  
  console.log('🎯 MissionDetailsDialog: Rendering with mission:', mission?.id || 'null');
  console.log('🎯 Mission status:', mission?.status);
  console.log('🎯 Mission start_km:', mission?.start_km);
  console.log('🎯 Mission end_km:', mission?.end_km);

  // Function to get user name by ID with proper type handling
  const getUserName = (userId: string) => {
    const user = users.find(u => {
      const userIdStr = u.id.toString();
      return userIdStr === userId;
    });
    return user ? user.name : `User ${userId}`;
  };

  // Function to get the driver (person with "Chauffeur" role)
  const getDriverName = () => {
    if (!mission?.userRoles || mission.userRoles.length === 0) {
      return mission?.driver || 'Aucun chauffeur assigné';
    }

    const driverUserRole = mission.userRoles.find(userRole => 
      userRole.roles.some(role => {
        if (typeof role === 'string') {
          return role === 'Chauffeur';
        } else if (typeof role === 'object' && role !== null) {
          const roleObj = role as any;
          return roleObj.name === 'Chauffeur';
        }
        return false;
      })
    );

    if (driverUserRole) {
      return getUserName(driverUserRole.userId);
    }

    return mission?.driver || 'Aucun chauffeur assigné';
  };

  // Local function to get van display info with separate model and plate
  const getVanInfo = (vanId: string) => {
    const van = vans.find(v => v.id === vanId || v.reference_code === vanId);
    if (van) {
      return {
        model: van.model || 'Modèle inconnu',
        licensePlate: van.license_plate || 'Plaque inconnue'
      };
    }
    return {
      model: getVanDisplayName(vanId) || vanId,
      licensePlate: 'Information non disponible'
    };
  };

  if (!mission) {
    console.log('🎯 MissionDetailsDialog: No mission provided');
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md fixed left-[50%] top-[5%] translate-x-[-50%] translate-y-0">
          <DialogHeader>
            <MissionHeader mission={{} as Trip} />
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );
  }

  const vanInfo = getVanInfo(mission.van);
  const driverName = getDriverName();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto fixed left-[50%] top-[5%] translate-x-[-50%] translate-y-0">
        <DialogHeader className="pb-6">
          <MissionHeader mission={mission} />
        </DialogHeader>

        <div className="space-y-6">
          <MissionOverview 
            mission={mission}
            driverName={driverName}
            vanInfo={vanInfo}
          />
          
          <MissionCompanies mission={mission} />
          
          <MissionTimeline mission={mission} />
          
          <MissionDestination mission={mission} />
          
          <MissionNotes mission={mission} />
          
          <MissionTeam mission={mission} />
          
          <MissionActions mission={mission} onClose={onClose} />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MissionDetailsDialog;
