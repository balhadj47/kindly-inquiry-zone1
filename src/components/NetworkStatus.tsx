
import React from 'react';

// Simplified NetworkStatus component that doesn't use hooks immediately
const NetworkStatus = () => {
  // Remove useState hook that was causing the error
  const isOnline = navigator.onLine;
  
  if (isOnline) {
    return null; // Don't show anything when online
  }
  
  return (
    <div className="fixed top-0 left-0 right-0 bg-red-500 text-white text-center py-2 z-50">
      You are currently offline
    </div>
  );
};

export default NetworkStatus;
