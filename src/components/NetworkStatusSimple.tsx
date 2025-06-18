
import React from 'react';

// Simplified NetworkStatus component without hooks
const NetworkStatusSimple: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  console.log('🌐 NetworkStatusSimple: Rendering without hooks');
  
  // Simply pass through children without network status checking for now
  // This eliminates the useState hook issue
  return <>{children}</>;
};

export default NetworkStatusSimple;
