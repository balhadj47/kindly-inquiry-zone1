import React from 'react';

// Debug provider disabled - keeping wrapper for compatibility
export const RBACDebugProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <>{children}</>;
};
