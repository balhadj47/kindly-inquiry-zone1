
import React from 'react';
import { Shield } from 'lucide-react';

const SidebarBranding = () => {
  return (
    <div className="flex items-center gap-3 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:gap-0">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white flex-shrink-0 group-data-[collapsible=icon]:h-8 group-data-[collapsible=icon]:w-8">
        <Shield className="h-5 w-5 group-data-[collapsible=icon]:h-4 group-data-[collapsible=icon]:w-4" />
      </div>
      <div className="group-data-[collapsible=icon]:hidden min-w-0">
        <h1 className="text-lg font-bold text-gray-900">SSB</h1>
        <p className="text-xs text-gray-500 font-medium">Fonds & Escorte</p>
      </div>
    </div>
  );
};

export default SidebarBranding;
