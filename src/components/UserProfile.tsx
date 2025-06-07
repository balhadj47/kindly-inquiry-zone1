
import React from 'react';
import { User, LogOut, Settings } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useRBAC } from '@/contexts/RBACContext';

const UserProfile = () => {
  const { currentUser, groups } = useRBAC();

  if (!currentUser) {
    return (
      <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
        <Avatar className="h-8 w-8">
          <AvatarFallback>
            <User className="h-4 w-4" />
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0 group-data-[collapsible=icon]:hidden">
          <p className="text-sm text-muted-foreground">Not logged in</p>
        </div>
      </div>
    );
  }

  const userGroup = groups.find(g => g.id === currentUser.groupId);
  const userInitials = currentUser.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex items-center gap-3 p-3 rounded-lg bg-sidebar-accent/50 hover:bg-sidebar-accent transition-colors cursor-pointer group-data-[collapsible=icon]:justify-center">
          <Avatar className="h-8 w-8">
            <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${currentUser.name}`} />
            <AvatarFallback className="bg-primary text-primary-foreground text-xs font-medium">
              {userInitials}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0 group-data-[collapsible=icon]:hidden">
            <p className="text-sm font-medium text-sidebar-foreground truncate">
              {currentUser.name}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {userGroup?.name || currentUser.role}
            </p>
          </div>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuItem>
          <User className="mr-2 h-4 w-4" />
          Profile
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Settings className="mr-2 h-4 w-4" />
          Settings
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-destructive focus:text-destructive">
          <LogOut className="mr-2 h-4 w-4" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserProfile;
