
import React from 'react';
import { Shield } from 'lucide-react';

const SidebarBranding = () => {
  return (
    <div className="flex items-center gap-3 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:gap-0">
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white flex-shrink-0 group-data-[collapsible=icon]:h-8 group-data-[collapsible=icon]:w-8">
        <Shield className="h-5 w-5 group-data-[collapsible=icon]:h-4 group-data-[collapsible=icon]:w-4" />
      </div>
      <div className="group-data-[collapsible=icon]:hidden min-w-0">
        <h1 className="text-lg font-semibold text-gray-900">SSB</h1>
        <p className="text-xs text-gray-500">Système de Suivi</p>
      </div>
    </div>
  );
};

export default SidebarBranding;
