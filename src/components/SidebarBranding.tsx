
import React from 'react';
import { Shield } from 'lucide-react';
import { useSystemSettings } from '@/hooks/useSystemSettings';

const SidebarBranding = () => {
  const { getSetting, isLoading } = useSystemSettings();

  if (isLoading) {
    return (
      <div className="flex flex-col items-center gap-3 group-data-[collapsible=icon]:gap-0 transition-all duration-300 ease-in-out">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg group-data-[collapsible=icon]:h-8 group-data-[collapsible=icon]:w-8 group-data-[collapsible=icon]:rounded-lg transition-all duration-300 ease-in-out">
          <Shield className="h-6 w-6 group-data-[collapsible=icon]:h-4 group-data-[collapsible=icon]:w-4 transition-all duration-300 ease-in-out" />
        </div>
        <div className="group-data-[collapsible=icon]:hidden group-data-[collapsible=icon]:opacity-0 text-center transition-all duration-300 ease-in-out">
          <div className="h-5 bg-gray-200 rounded animate-pulse mb-1 w-20"></div>
          <div className="h-3 bg-gray-200 rounded animate-pulse w-16"></div>
        </div>
      </div>
    );
  }

  const appName = getSetting('app_name', 'SSB');
  const appSlogan = getSetting('app_slogan', 'Fonds & Escorte');

  return (
    <div className="flex flex-col items-center gap-3 group-data-[collapsible=icon]:gap-0 transition-all duration-300 ease-in-out">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-blue-800 group-data-[collapsible=icon]:h-8 group-data-[collapsible=icon]:w-8 group-data-[collapsible=icon]:rounded-lg transition-all duration-300 ease-in-out cursor-pointer transform hover:scale-105 group-data-[collapsible=icon]:hover:scale-110">
        <Shield className="h-6 w-6 group-data-[collapsible=icon]:h-4 group-data-[collapsible=icon]:w-4 transition-all duration-300 ease-in-out" />
      </div>
      <div className="group-data-[collapsible=icon]:hidden group-data-[collapsible=icon]:opacity-0 group-data-[collapsible=icon]:scale-95 text-center min-w-0 transition-all duration-300 ease-in-out">
        <h1 className="text-lg font-bold text-gray-900 leading-tight whitespace-nowrap mb-0.5 tracking-tight">{appName}</h1>
        <p className="text-xs text-gray-600 font-medium leading-tight whitespace-nowrap">{appSlogan}</p>
      </div>
    </div>
  );
};

export default SidebarBranding;
