
import React from 'react';
import { Shield } from 'lucide-react';
import { useSystemSettings } from '@/hooks/useSystemSettings';

const SidebarBranding = () => {
  const { getSetting, isLoading } = useSystemSettings();

  if (isLoading) {
    return (
      <div className="flex items-center gap-3 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:gap-0 transition-all duration-300 ease-in-out">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white flex-shrink-0 group-data-[collapsible=icon]:h-7 group-data-[collapsible=icon]:w-7 transition-all duration-300 ease-in-out">
          <Shield className="h-4 w-4 group-data-[collapsible=icon]:h-4 group-data-[collapsible=icon]:w-4 transition-all duration-300 ease-in-out" />
        </div>
        <div className="group-data-[collapsible=icon]:hidden group-data-[collapsible=icon]:opacity-0 group-data-[collapsible=icon]:scale-95 min-w-0 transition-all duration-300 ease-in-out overflow-hidden">
          <div className="h-4 bg-gray-200 rounded animate-pulse mb-1"></div>
          <div className="h-3 bg-gray-200 rounded animate-pulse w-16"></div>
        </div>
      </div>
    );
  }

  const appName = getSetting('app_name', 'SSB');
  const appSlogan = getSetting('app_slogan', 'Fonds & Escorte');

  return (
    <div className="flex items-center gap-3 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:gap-0 transition-all duration-300 ease-in-out">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white flex-shrink-0 group-data-[collapsible=icon]:h-7 group-data-[collapsible=icon]:w-7 shadow-md hover:shadow-lg transition-all duration-300 ease-in-out">
        <Shield className="h-4 w-4 group-data-[collapsible=icon]:h-4 group-data-[collapsible=icon]:w-4 transition-all duration-300 ease-in-out" />
      </div>
      <div className="group-data-[collapsible=icon]:hidden group-data-[collapsible=icon]:opacity-0 group-data-[collapsible=icon]:scale-95 group-data-[collapsible=icon]:w-0 min-w-0 transition-all duration-300 ease-in-out overflow-hidden">
        <h1 className="text-sm font-bold text-gray-900 leading-tight whitespace-nowrap transition-all duration-300 ease-in-out">{appName}</h1>
        <p className="text-xs text-gray-500 font-medium leading-tight whitespace-nowrap transition-all duration-300 ease-in-out">{appSlogan}</p>
      </div>
    </div>
  );
};

export default SidebarBranding;
