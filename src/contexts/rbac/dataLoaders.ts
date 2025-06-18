
import { supabase } from '@/integrations/supabase/client';
import { User } from '@/types/rbac';
import { SystemGroup } from '@/types/systemGroups';
import { SystemGroupsService } from '@/services/systemGroupsService';

// Cache for faster subsequent loads
let usersCache: { data: User[]; timestamp: number } | null = null;
let rolesCache: { data: SystemGroup[]; timestamp: number } | null = null;
const CACHE_DURATION = 300000; // 5 minutes cache for RBAC data

export const loadUsers = async (useCache = true): Promise<User[]> => {
  try {
    console.log('🔄 Loading users from database...');
    const startTime = performance.now();
    
    // Check cache first
    if (useCache && usersCache) {
      const { data, timestamp } = usersCache;
      const isValid = Date.now() - timestamp < CACHE_DURATION;
      
      if (isValid) {
        console.log('✅ Users loaded from cache in:', performance.now() - startTime, 'ms');
        return data;
      }
    }

    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ Error loading users:', error);
      return usersCache?.data || [];
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

    // Update cache
    usersCache = {
      data: users,
      timestamp: Date.now()
    };

    const endTime = performance.now();
    console.log('✅ Users loaded successfully in:', endTime - startTime, 'ms -', users.length, 'users');
    return users;
  } catch (error) {
    console.error('❌ Exception loading users:', error);
    return usersCache?.data || [];
  }
};

export const loadRoles = async (useCache = true): Promise<SystemGroup[]> => {
  try {
    console.log('🔄 Loading system groups...');
    const startTime = performance.now();
    
    // Check cache first
    if (useCache && rolesCache) {
      const { data, timestamp } = rolesCache;
      const isValid = Date.now() - timestamp < CACHE_DURATION;
      
      if (isValid) {
        console.log('✅ Roles loaded from cache in:', performance.now() - startTime, 'ms');
        return data;
      }
    }

    // Load directly without cleanup for better performance
    const roles = await SystemGroupsService.loadSystemGroups();
    
    // Update cache
    rolesCache = {
      data: roles,
      timestamp: Date.now()
    };

    const endTime = performance.now();
    console.log('✅ Roles loaded successfully in:', endTime - startTime, 'ms -', roles.length, 'roles');
    return roles;
  } catch (error) {
    console.error('❌ Error loading roles:', error);
    return rolesCache?.data || [];
  }
};

// Function to clear caches when needed
export const clearRBACCache = () => {
  console.log('🧹 Clearing RBAC cache');
  usersCache = null;
  rolesCache = null;
};
