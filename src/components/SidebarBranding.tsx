
import React from 'react';
import { Shield } from 'lucide-react';
import { useSystemSettings } from '@/hooks/useSystemSettings';

const SidebarBranding = () => {
  const { getSetting, isLoading } = useSystemSettings();

  if (isLoading) {
    return (
      <div className="flex items-center gap-3 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:gap-0">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white flex-shrink-0 group-data-[collapsible=icon]:h-8 group-data-[collapsible=icon]:w-8">
          <Shield className="h-5 w-5 group-data-[collapsible=icon]:h-4 group-data-[collapsible=icon]:w-4" />
        </div>
        <div className="group-data-[collapsible=icon]:hidden min-w-0">
          <div className="h-5 bg-gray-200 rounded animate-pulse mb-1"></div>
          <div className="h-3 bg-gray-200 rounded animate-pulse w-20"></div>
        </div>
      </div>
    );
  }

  const appName = getSetting('app_name', 'SSB');
  const appSlogan = getSetting('app_slogan', 'Fonds & Escorte');

  return (
    <div className="flex items-center gap-3 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:gap-0">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white flex-shrink-0 group-data-[collapsible=icon]:h-8 group-data-[collapsible=icon]:w-8">
        <Shield className="h-5 w-5 group-data-[collapsible=icon]:h-4 group-data-[collapsible=icon]:w-4" />
      </div>
      <div className="group-data-[collapsible=icon]:hidden min-w-0">
        <h1 className="text-lg font-bold text-gray-900">{appName}</h1>
        <p className="text-xs text-gray-500 font-medium">{appSlogan}</p>
      </div>
    </div>
  );
};

export default SidebarBranding;
