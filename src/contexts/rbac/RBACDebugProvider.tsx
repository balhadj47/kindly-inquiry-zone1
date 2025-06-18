
import React from 'react';

// Temporary debugging wrapper to catch React context issues
export const RBACDebugProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  console.log('🔍 RBACDebugProvider: Rendering with React context');
  
  // Check if React is properly available
  if (!React || !React.useState) {
    console.error('❌ React or React.useState is not available');
    return <div>React Error: useState not available</div>;
  }

  console.log('✅ React and useState are available');
  return <>{children}</>;
};
