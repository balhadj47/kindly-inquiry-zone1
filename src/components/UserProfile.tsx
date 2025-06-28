
import React from 'react';
import { User, LogOut } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useRBAC } from '@/contexts/RBACContext';
import { useSystemSettings } from '@/hooks/useSystemSettings';
import { useRoleData } from '@/hooks/useRoleData';

const UserProfile = () => {
  const { user, signOut } = useAuth();
  const { t } = useLanguage();
  const { currentUser } = useRBAC();
  const { getSetting } = useSystemSettings();

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

  const footerText = getSetting('footer_text', '© 2025 asdar it');
  const footerLink = getSetting('footer_link', 'https://asdar.net');

  console.log('UserProfile: Rendering with user:', user?.email);
  console.log('UserProfile: Current RBAC user:', currentUser);
  console.log('UserProfile: Auth user metadata:', user?.user_metadata);

  if (!user) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:p-2">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-gray-300">
              <User className="h-4 w-4 text-gray-600" />
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0 group-data-[collapsible=icon]:hidden">
            <p className="text-sm text-gray-500 font-medium">Not logged in</p>
          </div>
        </div>
        <div className="px-2 group-data-[collapsible=icon]:hidden">
          <p className="text-xs text-gray-400 text-center font-medium">
            {footerText} | <a href={footerLink} target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 transition-colors">asdar.net</a>
          </p>
        </div>
      </div>
    );
  }

  // Get user name and role information from auth metadata and RBAC context
  const userName = user.user_metadata?.name || currentUser?.name || user.email?.split('@')[0] || 'User';
  const userRoleId = user.user_metadata?.role_id || currentUser?.role_id || 2;
  const { roleName: userRole } = useRoleData(userRoleId);
  
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
    <div className="space-y-4">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:p-2 relative group">
            <Avatar className="h-8 w-8">
              <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${userName}`} />
              <AvatarFallback className="bg-blue-600 text-white text-xs font-bold">
                {userInitials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0 group-data-[collapsible=icon]:hidden">
              <p className="text-sm font-semibold text-gray-900 truncate">
                {userName}
              </p>
              <p className="text-xs text-gray-500 truncate font-medium">
                {userRole}
              </p>
            </div>
            {/* Tooltip for collapsed state */}
            <div className="hidden group-data-[collapsible=icon]:block absolute left-full ml-4 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 shadow-lg">
              {userName}
              <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-gray-900 rotate-45"></div>
            </div>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuItem 
            className="text-destructive focus:text-destructive cursor-pointer"
            onClick={handleSignOut}
          >
            <LogOut className="mr-2 h-4 w-4" />
            {t.signOut}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      
      <div className="px-2 group-data-[collapsible=icon]:hidden">
        <p className="text-xs text-gray-400 text-center font-medium">
          {footerText} | <a href={footerLink} target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 transition-colors">asdar.net</a>
        </p>
      </div>
    </div>
  );
};

export default UserProfile;
