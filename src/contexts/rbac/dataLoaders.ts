
import { supabase } from '@/integrations/supabase/client';
import { User } from '@/types/rbac';
import { SystemGroup } from '@/types/systemGroups';
import { SystemGroupsService } from '@/services/systemGroupsService';
import { DatabaseCleanupService } from '@/services/databaseCleanupService';

export const loadUsers = async (): Promise<User[]> => {
  try {
    console.log('🔄 Loading users from database...');
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ Error loading users:', error);
      return [];
    }

    // Transform the database data to match our User interface
    const users: User[] = (data || []).map(user => ({
      id: user.id.toString(),
      name: user.name || '',
      email: user.email || '',
      phone: user.phone || '',
      systemGroup: user.role as any,
      status: user.status as any,
      createdAt: user.created_at,
      totalTrips: user.total_trips || 0,
      lastTrip: user.last_trip,
      profileImage: user.profile_image,
      // Add backward compatibility getter
      get role() { return this.systemGroup; }
    }));

    console.log('✅ Users loaded successfully:', users.length);
    return users;
  } catch (error) {
    console.error('❌ Exception loading users:', error);
    return [];
  }
};

export const loadRoles = async (): Promise<SystemGroup[]> => {
  try {
    console.log('🔄 Loading system groups with cleanup...');
    
    // Run cleanup first to ensure clean state
    await DatabaseCleanupService.runFullCleanup();
    
    return await SystemGroupsService.loadSystemGroups();
  } catch (error) {
    console.error('❌ Error loading roles with cleanup:', error);
    return await SystemGroupsService.loadSystemGroups();
  }
};
