
import React from 'react';
import { Shield } from 'lucide-react';

const SidebarBranding = () => {
  return (
    <div className="flex items-center gap-3 group-data-[collapsible=icon]:justify-center">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white shadow-lg shadow-blue-500/25 flex-shrink-0">
        <Shield className="h-5 w-5" />
      </div>
      <div className="group-data-[collapsible=icon]:hidden min-w-0 transition-all duration-200">
        <h1 className="text-xl font-bold text-gray-900 truncate">SSB</h1>
        <p className="text-xs text-gray-500 font-medium">Système de Suivi</p>
      </div>
    </div>
  );
};

export default SidebarBranding;
