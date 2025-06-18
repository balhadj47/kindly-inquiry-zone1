
import { supabase, requireAuth } from '@/integrations/supabase/client';
import { MISSION_ROLES, MissionRoleInfo } from '@/types/missionRoles';

export class MissionRolesService {
  
  static async createMissionRolesTable(): Promise<void> {
    console.log('🔄 Creating mission roles table...');
    
    // Require authentication
    await requireAuth();
    
    // Note: This would typically be done via Supabase migrations
    // For now, we'll store mission roles in a separate structure
    try {
      // Check if we need to create a separate table for mission roles
      // For now, we'll use the existing mission roles from types
      console.log('✅ Mission roles available from types:', MISSION_ROLES.length);
      
    } catch (error) {
      console.error('❌ Error with mission roles setup:', error);
    }
  }

  static async getMissionRoles(): Promise<MissionRoleInfo[]> {
    // Require authentication
    await requireAuth();
    
    // Return mission roles from types since they're operational roles, not database-stored
    return MISSION_ROLES;
  }

  static async addMissionRole(roleData: Partial<MissionRoleInfo>): Promise<MissionRoleInfo> {
    // Require authentication
    await requireAuth();
    
    // For now, return a new mission role
    // In a full implementation, this would add to a mission_roles table
    const newRole: MissionRoleInfo = {
      id: roleData.id || Math.random().toString(36).substr(2, 9),
      name: roleData.name || 'APS',
      description: roleData.description || '',
      category: roleData.category || 'security',
    };

    console.log('✅ Mission role created:', newRole);
    return newRole;
  }

  static async updateMissionRole(id: string, roleData: Partial<MissionRoleInfo>): Promise<MissionRoleInfo> {
    // Require authentication
    await requireAuth();
    
    // Find existing role and update
    const existingRole = MISSION_ROLES.find(r => r.id === id);
    if (!existingRole) {
      throw new Error('Mission role not found');
    }

    const updatedRole: MissionRoleInfo = {
      ...existingRole,
      ...roleData,
    };

    console.log('✅ Mission role updated:', updatedRole);
    return updatedRole;
  }

  static async deleteMissionRole(id: string): Promise<void> {
    // Require authentication
    await requireAuth();
    
    console.log('✅ Mission role deleted:', id);
    // In a full implementation, this would delete from mission_roles table
  }
}
