
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
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useRBAC } from '@/contexts/RBACContext';
import { getRoleNameFromId } from '@/utils/roleUtils';
import { Link } from 'react-router-dom';

const UserProfile = () => {
  const { user, signOut } = useAuth();
  const { t } = useLanguage();
  const { currentUser } = useRBAC();

  const handleSignOut = async () => {
    console.log('UserProfile: Attempting to sign out...');
    console.log('UserProfile: Current user:', user?.id);
    console.log('UserProfile: Translation for signOut:', t.signOut);
    
    try {
      const { error } = await signOut();
      if (error) {
        console.error('UserProfile: Sign out error:', error);
      } else {
        console.log('UserProfile: Sign out successful');
      }
    } catch (error) {
      console.error('UserProfile: Unexpected error during sign out:', error);
    }
  };

  console.log('UserProfile: Rendering with user:', user?.email);
  console.log('UserProfile: Current RBAC user:', currentUser);
  console.log('UserProfile: Current language context:', { 
    signOut: t.signOut, 
    settings: t.settings 
  });

  if (!user) {
    return (
      <div className="space-y-3">
        <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 group-data-[collapsible=icon]:justify-center">
          <Avatar className="h-8 w-8">
            <AvatarFallback>
              <User className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0 group-data-[collapsible=icon]:hidden">
            <p className="text-sm text-gray-500">Not logged in</p>
          </div>
        </div>
        <div className="px-3 group-data-[collapsible=icon]:hidden">
          <p className="text-xs text-gray-500 text-center">
            © 2025 asdar it | <a href="https://asdar.net" target="_blank" rel="noopener noreferrer" className="hover:underline">asdar.net</a>
          </p>
        </div>
      </div>
    );
  }

  // Get user name and role information
  const userName = currentUser?.name || user.email?.split('@')[0] || 'User';
  const userRole = currentUser?.role_id ? getRoleNameFromId(currentUser.role_id) : 'Employee';
  
  const userInitials = userName
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase() || user.email
    ?.split('@')[0]
    .split('.')
    .map(n => n[0])
    .join('')
    .toUpperCase() || 'U';

  return (
    <div className="space-y-3">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer group-data-[collapsible=icon]:justify-center">
            <Avatar className="h-8 w-8">
              <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${userName}`} />
              <AvatarFallback className="bg-blue-600 text-white text-xs font-medium">
                {userInitials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0 group-data-[collapsible=icon]:hidden">
              <p className="text-sm font-medium text-gray-900 truncate">
                {userName}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {userRole}
              </p>
            </div>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuItem asChild>
            <Link to="/settings">
              <Settings className="mr-2 h-4 w-4" />
              {t.settings}
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem 
            className="text-destructive focus:text-destructive cursor-pointer"
            onClick={handleSignOut}
          >
            <LogOut className="mr-2 h-4 w-4" />
            {t.signOut}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      
      <div className="px-3 group-data-[collapsible=icon]:hidden">
        <p className="text-xs text-gray-500 text-center">
          © 2025 asdar it | <a href="https://asdar.net" target="_blank" rel="noopener noreferrer" className="hover:underline">asdar.net</a>
        </p>
      </div>
    </div>
  );
};

export default UserProfile;
