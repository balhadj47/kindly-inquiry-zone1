
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ChevronLeft, User, Settings, LogOut } from 'lucide-react';
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

const SidebarUserProfile = () => {
  const { currentUser } = useRBAC();
  const { signOut } = useAuth();
  const { toggleSidebar } = useSidebar();
  const navigate = useNavigate();

  const userInitials = currentUser?.email ? 
    currentUser.email.split('@')[0].substring(0, 2).toUpperCase() : 
    'U';

  const userName = currentUser?.email?.split('@')[0] || 'User';
  const userRole = currentUser?.role_id === 1 ? 'Admin' : 'Manager';
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
    <div className="flex items-center justify-between p-4 border-b border-gray-200">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div 
            className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 rounded-lg p-2 -m-2 transition-colors flex-1"
          >
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
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-56">
          <DropdownMenuItem onClick={handleUserProfileClick} className="cursor-pointer">
            <User className="mr-2 h-4 w-4" />
            Profile Settings
          </DropdownMenuItem>
          {isAdmin && (
            <DropdownMenuItem onClick={handleWebsiteSettingsClick} className="cursor-pointer">
              <Settings className="mr-2 h-4 w-4" />
              Website Settings
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-red-600 focus:text-red-600">
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      
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
