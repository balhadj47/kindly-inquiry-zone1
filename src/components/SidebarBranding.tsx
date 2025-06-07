
import React from 'react';
import { Shield } from 'lucide-react';

const SidebarBranding = () => {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-blue-800 text-white shadow-lg flex-shrink-0">
        <Shield className="h-4 w-4" />
      </div>
      <div className="group-data-[collapsible=icon]:hidden min-w-0">
        <h1 className="text-lg font-bold text-foreground truncate">SSB</h1>
        <p className="text-xs text-muted-foreground truncate">transport de fonds</p>
      </div>
    </div>
  );
};

export default SidebarBranding;
