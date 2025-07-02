
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ChevronUp, User, Settings, LogOut, PanelLeftClose } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useRBAC } from '@/contexts/RBACContext';
import { useAuth } from '@/contexts/AuthContext';
import { useSidebar } from '@/components/ui/sidebar';
import { useRoleData } from '@/hooks/useRoleData';

const SidebarUserProfile = () => {
  const { currentUser } = useRBAC();
  const { signOut } = useAuth();
  const { toggleSidebar } = useSidebar();
  const navigate = useNavigate();

  const userInitials = currentUser?.name ? 
    currentUser.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 
    (currentUser?.email ? currentUser.email.split('@')[0].substring(0, 2).toUpperCase() : 'U');

  const userName = currentUser?.name || currentUser?.email?.split('@')[0] || 'User';
  const { roleName: userRole } = useRoleData(currentUser?.role_id || 3);
  const isAdmin = currentUser?.role_id === 1;

  const handleUserProfileClick = () => {
    navigate('/user-settings');
  };

  const handleWebsiteSettingsClick = () => {
    navigate('/settings');
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  return (
    <div className="flex items-center justify-between p-3 border-t border-gray-100 bg-gray-50/50 group-data-[collapsible=icon]:p-2 group-data-[collapsible=icon]:justify-center sticky bottom-0">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div 
            className="flex items-center gap-2 cursor-pointer hover:bg-white/80 rounded-lg p-2 -m-2 transition-all duration-200 ease-in-out flex-1 group group-data-[collapsible=icon]:flex-none group-data-[collapsible=icon]:m-0 group-data-[collapsible=icon]:p-1"
          >
            <Avatar className="h-8 w-8 flex-shrink-0 ring-2 ring-white shadow-sm transition-all duration-200 group-hover:ring-blue-100 group-data-[collapsible=icon]:h-7 group-data-[collapsible=icon]:w-7">
              <AvatarImage src="" />
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white font-bold text-xs group-data-[collapsible=icon]:text-xs">
                {userInitials}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col group-data-[collapsible=icon]:hidden min-w-0 flex-1">
              <span className="text-gray-900 font-semibold text-sm truncate leading-tight">{userName}</span>
              <span className="text-gray-500 text-xs truncate font-medium">{userRole}</span>
            </div>
            <ChevronUp className="h-3 w-3 text-gray-400 group-data-[collapsible=icon]:hidden transition-all duration-200 group-hover:text-gray-600" />
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" side="top" className="w-56 mb-2 shadow-lg border-0 bg-white/95 backdrop-blur-sm">
          <DropdownMenuItem onClick={handleUserProfileClick} className="cursor-pointer hover:bg-blue-50 transition-colors duration-200">
            <User className="mr-2 h-4 w-4 text-blue-600" />
            <span className="font-medium">Profile Settings</span>
          </DropdownMenuItem>
          {isAdmin && (
            <DropdownMenuItem onClick={handleWebsiteSettingsClick} className="cursor-pointer hover:bg-blue-50 transition-colors duration-200">
              <Settings className="mr-2 h-4 w-4 text-blue-600" />
              <span className="font-medium">Website Settings</span>
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator className="bg-gray-200" />
          <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-red-600 hover:text-red-700 hover:bg-red-50 focus:text-red-700 transition-colors duration-200">
            <LogOut className="mr-2 h-4 w-4" />
            <span className="font-medium">Sign Out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleSidebar}
        className="h-7 w-7 text-gray-400 hover:text-gray-600 hover:bg-white/80 group-data-[collapsible=icon]:hidden flex-shrink-0 ml-1 transition-all duration-200"
      >
        <PanelLeftClose className="h-3 w-3" />
      </Button>
    </div>
  );
};

export default SidebarUserProfile;
