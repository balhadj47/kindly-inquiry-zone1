
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import { useRBAC } from '@/contexts/RBACContext';
import { useSidebar } from '@/components/ui/sidebar';

const SidebarUserProfile = () => {
  const { currentUser } = useRBAC();
  const { toggleSidebar } = useSidebar();

  const userInitials = currentUser?.email ? 
    currentUser.email.split('@')[0].substring(0, 2).toUpperCase() : 
    'U';

  const userName = currentUser?.email?.split('@')[0] || 'User';
  const userRole = currentUser?.role_id === 1 ? 'Admin' : 'Manager';

  return (
    <div className="flex items-center justify-between p-4 border-b border-gray-200">
      <div className="flex items-center gap-3">
        <Avatar className="h-10 w-10">
          <AvatarImage src="" />
          <AvatarFallback className="bg-blue-500 text-white font-semibold">
            {userInitials}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col group-data-[collapsible=icon]:hidden">
          <span className="text-gray-900 font-medium text-sm">{userName}</span>
          <span className="text-gray-500 text-xs">{userRole}</span>
        </div>
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleSidebar}
        className="h-8 w-8 text-gray-500 hover:text-gray-700 hover:bg-gray-100 group-data-[collapsible=icon]:hidden"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default SidebarUserProfile;
