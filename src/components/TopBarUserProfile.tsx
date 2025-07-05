
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronDown, User, Settings, LogOut } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useRBAC } from '@/contexts/RBACContext';
import { useAuth } from '@/contexts/AuthContext';
import { useRoleData } from '@/hooks/useRoleData';

const TopBarUserProfile = () => {
  const { currentUser } = useRBAC();
  const { signOut } = useAuth();
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
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex items-center gap-3 px-3 py-2 h-auto hover:bg-accent transition-colors duration-200"
        >
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8 ring-2 ring-white shadow-sm">
              <AvatarImage src={defaultImage} />
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white font-bold text-xs">
                {userInitials}
              </AvatarFallback>
            </Avatar>
            <div className="hidden sm:flex flex-col items-start">
              <span className="font-medium text-sm text-gray-900 truncate max-w-32">
                {userName}
              </span>
              <Badge variant={getRoleBadgeVariant()} className="text-xs">
                {userRole}
              </Badge>
            </div>
          </div>
          <ChevronDown className="h-4 w-4 text-gray-400 hidden sm:block" />
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end" className="w-56 shadow-lg border-0 bg-white/95 backdrop-blur-sm">
        <div className="p-3 border-b border-gray-100 sm:hidden">
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
  );
};

export default TopBarUserProfile;
