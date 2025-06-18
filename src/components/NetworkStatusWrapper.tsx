import React from 'react';

// This component is no longer needed since we're using React.lazy directly in App.tsx
// Keeping it as a simple passthrough for backward compatibility
const NetworkStatusWrapper = ({ children }: { children?: React.ReactNode }) => {
  return (
    <>
      {children}
    </>
  );
};

export default NetworkStatusWrapper;
