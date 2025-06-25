
import React from 'react';
import { Shield } from 'lucide-react';
import { useSystemSettings } from '@/hooks/useSystemSettings';

const SidebarBranding = () => {
  const { getSetting, isLoading } = useSystemSettings();

  if (isLoading) {
    return (
      <div className="flex items-center gap-3 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:gap-0">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white flex-shrink-0 group-data-[collapsible=icon]:h-6 group-data-[collapsible=icon]:w-6">
          <Shield className="h-4 w-4 group-data-[collapsible=icon]:h-3 group-data-[collapsible=icon]:w-3" />
        </div>
        <div className="group-data-[collapsible=icon]:hidden min-w-0">
          <div className="h-4 bg-gray-200 rounded animate-pulse mb-1"></div>
          <div className="h-3 bg-gray-200 rounded animate-pulse w-16"></div>
        </div>
      </div>
    );
  }

  const appName = getSetting('app_name', 'SSB');
  const appSlogan = getSetting('app_slogan', 'Fonds & Escorte');

  return (
    <div className="flex items-center gap-3 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:gap-0">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white flex-shrink-0 group-data-[collapsible=icon]:h-6 group-data-[collapsible=icon]:w-6 transition-all duration-200">
        <Shield className="h-4 w-4 group-data-[collapsible=icon]:h-3 group-data-[collapsible=icon]:w-3" />
      </div>
      <div className="group-data-[collapsible=icon]:hidden min-w-0 transition-all duration-200">
        <h1 className="text-sm font-bold text-gray-900 leading-tight">{appName}</h1>
        <p className="text-xs text-gray-500 font-medium leading-tight">{appSlogan}</p>
      </div>
    </div>
  );
};

export default SidebarBranding;
