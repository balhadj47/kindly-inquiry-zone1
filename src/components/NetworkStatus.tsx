
import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff } from 'lucide-react';
import { getNetworkStatus, addNetworkStatusListener } from '@/utils/serviceWorker';

const NetworkStatus: React.FC = () => {
  const [isOnline, setIsOnline] = useState(getNetworkStatus());
  const [showStatus, setShowStatus] = useState(false);

  useEffect(() => {
    const removeListener = addNetworkStatusListener((online) => {
      setIsOnline(online);
      setShowStatus(true);
      
      // Hide status after 3 seconds if back online
      if (online) {
        setTimeout(() => setShowStatus(false), 3000);
      }
    });

    return removeListener;
  }, []);

  if (!showStatus && isOnline) {
    return null;
  }

  return (
    <div className={`
      fixed top-4 right-4 z-50 flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium
      ${isOnline 
        ? 'bg-green-100 text-green-800 border border-green-300' 
        : 'bg-red-100 text-red-800 border border-red-300'
      }
    `}>
      {isOnline ? (
        <>
          <Wifi size={16} />
          <span>Connexion rétablie</span>
        </>
      ) : (
        <>
          <WifiOff size={16} />
          <span>Mode hors ligne</span>
        </>
      )}
    </div>
  );
};

export default NetworkStatus;
