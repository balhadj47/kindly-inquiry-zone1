
import React from 'react';
import { WifiOff } from 'lucide-react';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';

const NetworkStatus = () => {
  const isOnline = useNetworkStatus();

  if (isOnline) {
    return null; // Don't show anything when online
  }

  return (
    <div className="fixed top-4 right-4 bg-red-500 text-white px-3 py-2 rounded-lg shadow-lg flex items-center gap-2 z-50">
      <WifiOff className="h-4 w-4" />
      <span className="text-sm">No internet connection</span>
    </div>
  );
};

export default NetworkStatus;
