
import React from 'react';
import { Shield } from 'lucide-react';
import { useSystemSettings } from '@/hooks/useSystemSettings';

const SidebarBranding = () => {
  const { getSetting, isLoading } = useSystemSettings();

  if (isLoading) {
    return (
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md">
          <Shield className="h-5 w-5" />
        </div>
        <div className="flex flex-col">
          <div className="h-4 bg-gray-200 rounded animate-pulse mb-1 w-16"></div>
          <div className="h-3 bg-gray-200 rounded animate-pulse w-20"></div>
        </div>
      </div>
    );
  }

  const appName = getSetting('app_name', 'SSB');
  const appSlogan = getSetting('app_slogan', 'Fonds & Escorte');

  return (
    <div className="flex items-center gap-3 cursor-pointer group">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-md hover:shadow-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 transform hover:scale-105">
        <Shield className="h-5 w-5 transition-all duration-300" />
      </div>
      <div className="flex flex-col min-w-0">
        <h1 className="text-lg font-bold text-gray-900 leading-tight tracking-tight group-hover:text-blue-700 transition-colors duration-200">{appName}</h1>
        <p className="text-xs text-gray-600 font-medium leading-tight group-hover:text-blue-600 transition-colors duration-200">{appSlogan}</p>
      </div>
    </div>
  );
};

export default SidebarBranding;
