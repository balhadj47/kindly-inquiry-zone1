
import React from 'react';
import { Truck } from 'lucide-react';

const SidebarBranding = () => {
  return (
    <div className="flex items-center gap-3 px-2">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
        <Truck className="h-4 w-4" />
      </div>
      <div>
        <h1 className="text-lg font-bold text-foreground group-data-[collapsible=icon]:hidden">Van Fleet</h1>
        <p className="text-xs text-muted-foreground group-data-[collapsible=icon]:hidden">Management System</p>
      </div>
    </div>
  );
};

export default SidebarBranding;
