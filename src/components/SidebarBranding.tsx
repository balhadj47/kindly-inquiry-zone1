
import React from 'react';
import { Shield } from 'lucide-react';
import { useSystemSettings } from '@/hooks/useSystemSettings';

const SidebarBranding = () => {
  const { getSetting, isLoading } = useSystemSettings();

  if (isLoading) {
    return (
      <div className="flex flex-col items-center gap-4 group-data-[collapsible=icon]:items-center transition-all duration-300 ease-in-out">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg group-data-[collapsible=icon]:h-10 group-data-[collapsible=icon]:w-10 group-data-[collapsible=icon]:rounded-xl transition-all duration-300 ease-in-out">
          <Shield className="h-7 w-7 group-data-[collapsible=icon]:h-5 group-data-[collapsible=icon]:w-5 transition-all duration-300 ease-in-out" />
        </div>
        <div className="group-data-[collapsible=icon]:hidden group-data-[collapsible=icon]:opacity-0 text-center transition-all duration-300 ease-in-out">
          <div className="h-6 bg-gray-200 rounded animate-pulse mb-2 w-24"></div>
          <div className="h-4 bg-gray-200 rounded animate-pulse w-20"></div>
        </div>
      </div>
    );
  }

  const appName = getSetting('app_name', 'SSB');
  const appSlogan = getSetting('app_slogan', 'Fonds & Escorte');

  return (
    <div className="flex flex-col items-center gap-4 group-data-[collapsible=icon]:items-center transition-all duration-300 ease-in-out">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-xl hover:shadow-2xl hover:from-blue-700 hover:to-blue-800 group-data-[collapsible=icon]:h-10 group-data-[collapsible=icon]:w-10 group-data-[collapsible=icon]:rounded-xl transition-all duration-300 ease-in-out cursor-pointer transform hover:scale-105">
        <Shield className="h-7 w-7 group-data-[collapsible=icon]:h-5 group-data-[collapsible=icon]:w-5 transition-all duration-300 ease-in-out" />
      </div>
      <div className="group-data-[collapsible=icon]:hidden group-data-[collapsible=icon]:opacity-0 group-data-[collapsible=icon]:scale-95 text-center min-w-0 transition-all duration-300 ease-in-out">
        <h1 className="text-xl font-bold text-gray-900 leading-tight whitespace-nowrap mb-1 tracking-tight">{appName}</h1>
        <p className="text-sm text-gray-600 font-medium leading-tight whitespace-nowrap">{appSlogan}</p>
      </div>
    </div>
  );
};

export default SidebarBranding;
