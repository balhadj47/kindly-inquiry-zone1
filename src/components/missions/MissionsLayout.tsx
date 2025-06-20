
import React from 'react';

interface MissionsLayoutProps {
  children: React.ReactNode;
}

const MissionsLayout: React.FC<MissionsLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-8">
        {children}
      </div>
    </div>
  );
};

export default MissionsLayout;
