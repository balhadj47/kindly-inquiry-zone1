
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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

  // Always provide a default image using Dicebear API
  const defaultImage = `https://api.dicebear.com/7.x/initials/svg?seed=${userName}`;

  // Get role badge color based on role
  const getRoleBadgeVariant = () => {
    switch (currentUser?.role_id) {
      case 1: return 'destructive'; // Admin
      case 2: return 'default'; // Supervisor
      default: return 'secondary'; // Employee
    }
  };

  return (
    <div className="relative border-t border-gray-100 bg-gradient-to-r from-gray-50/50 to-white group-data-[collapsible=icon]:border-0">
      {/* Collapsed state - Icon only */}
      <div className="group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:p-3 hidden">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 rounded-full ring-2 ring-white shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105"
            >
              <Avatar className="h-8 w-8">
                <AvatarImage src={defaultImage} />
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white font-bold text-xs">
                  {userInitials}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="center" side="right" className="w-56 shadow-lg border-0 bg-white/95 backdrop-blur-sm">
            <div className="p-3 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10 ring-2 ring-white shadow-sm">
                  <AvatarImage src={defaultImage} />
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white font-bold">
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 truncate">{userName}</p>
                  <Badge variant={getRoleBadgeVariant()} className="text-xs mt-1">
                    {userRole}
                  </Badge>
                </div>
              </div>
            </div>
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
      </div>

      {/* Expanded state - Full profile layout */}
      <div className="group-data-[collapsible=icon]:hidden">
        <div className="p-4 space-y-3">
          {/* Profile Header */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <Avatar className="h-12 w-12 ring-2 ring-white shadow-lg transition-all duration-200 hover:shadow-xl">
                <AvatarImage src={defaultImage} />
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white font-bold text-sm">
                  {userInitials}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full shadow-sm"></div>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 truncate text-sm leading-tight">{userName}</h3>
              <Badge variant={getRoleBadgeVariant()} className="text-xs mt-1 font-medium">
                {userRole}
              </Badge>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSidebar}
              className="h-8 w-8 text-gray-400 hover:text-gray-600 hover:bg-white/80 flex-shrink-0 transition-all duration-200 rounded-lg"
            >
              <PanelLeftClose className="h-4 w-4" />
            </Button>
          </div>

          {/* Quick Actions */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleUserProfileClick}
              className="flex-1 h-8 text-xs font-medium border-gray-200 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 transition-all duration-200"
            >
              <User className="mr-1.5 h-3 w-3" />
              Profile
            </Button>
            {isAdmin && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleWebsiteSettingsClick}
                className="flex-1 h-8 text-xs font-medium border-gray-200 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 transition-all duration-200"
              >
                <Settings className="mr-1.5 h-3 w-3" />
                Settings
              </Button>
            )}
          </div>

          {/* Sign Out Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSignOut}
            className="w-full h-8 text-xs font-medium text-red-600 hover:text-red-700 hover:bg-red-50 transition-all duration-200 justify-start"
          >
            <LogOut className="mr-2 h-3 w-3" />
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SidebarUserProfile;
