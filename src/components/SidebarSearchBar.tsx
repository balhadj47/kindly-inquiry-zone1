
import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

const SidebarSearchBar = () => {
  return (
    <div className="p-4 group-data-[collapsible=icon]:hidden">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search"
          className="w-full pl-10 bg-gray-800 border-gray-700 text-white placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500"
        />
      </div>
    </div>
  );
};

export default SidebarSearchBar;
