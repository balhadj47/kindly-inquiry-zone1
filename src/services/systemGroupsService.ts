
import { supabase } from '@/integrations/supabase/client';
import { SystemGroup, DEFAULT_SYSTEM_GROUPS } from '@/types/systemGroups';
import { DatabaseCleanupService } from './databaseCleanupService';

export class SystemGroupsService {
  static async loadSystemGroups(): Promise<SystemGroup[]> {
    try {
      console.log('🔄 Loading system groups from database...');
      
      const { data, error } = await supabase
        .from('user_groups')
        .select('*')
        .order('name', { ascending: true });

      if (error) {
        console.error('❌ Error loading system groups:', error);
        return DEFAULT_SYSTEM_GROUPS;
      }

      if (!data || data.length === 0) {
        console.log('🔄 No groups found, running cleanup and creating defaults...');
        await DatabaseCleanupService.runFullCleanup();
        return DEFAULT_SYSTEM_GROUPS;
      }

      // Check if we have duplicates or old formats and clean if needed
      const names = data.map(g => g.name);
      const hasDuplicates = names.some((name, index) => names.indexOf(name) !== index);
      const hasOldPermissions = data.some(g => 
        g.permissions?.some((p: string) => p.includes('.'))
      );

      if (hasDuplicates || hasOldPermissions) {
        console.log('🧹 Detected inconsistencies, running cleanup...');
        await DatabaseCleanupService.runFullCleanup();
        return DEFAULT_SYSTEM_GROUPS;
      }

      const groups = this.transformDatabaseToSystemGroups(data);
      console.log('✅ System groups loaded:', groups.length);
      return groups;
    } catch (error) {
      console.error('❌ Exception loading system groups:', error);
      return DEFAULT_SYSTEM_GROUPS;
    }
  }

  static async createSystemGroup(groupData: Partial<SystemGroup>): Promise<SystemGroup> {
    try {
      const newGroup: SystemGroup = {
        id: groupData.id || Math.random().toString(36).substr(2, 9),
        name: groupData.name || 'Employee',
        description: groupData.description || '',
        permissions: groupData.permissions || [],
        color: this.standardizeColor(groupData.color || '#3b82f6'),
        isSystemRole: false,
      };

      const { data, error } = await supabase
        .from('user_groups')
        .insert({
          id: newGroup.id,
          name: newGroup.name,
          description: newGroup.description,
          permissions: newGroup.permissions,
          color: newGroup.color,
        })
        .select()
        .single();

      if (error) {
        console.error('❌ Error creating system group:', error);
        throw new Error(`Failed to create system group: ${error.message}`);
      }

      console.log('✅ System group created:', data);
      return this.transformDatabaseToSystemGroup(data);
    } catch (error) {
      console.error('❌ Exception creating system group:', error);
      throw error;
    }
  }

  static async updateSystemGroup(id: string, groupData: Partial<SystemGroup>): Promise<SystemGroup> {
    try {
      // Check if this is a system role before allowing updates
      const isSystemRole = await this.isSystemRole(id);
      if (isSystemRole) {
        // Allow limited updates to system roles (description, color) but not name or core permissions
        const allowedUpdates: any = {};
        if (groupData.description) allowedUpdates.description = groupData.description;
        if (groupData.color) allowedUpdates.color = this.standardizeColor(groupData.color);
        
        if (Object.keys(allowedUpdates).length === 0) {
          throw new Error('System roles cannot be modified in this way');
        }

        const { data, error } = await supabase
          .from('user_groups')
          .update(allowedUpdates)
          .eq('id', id)
          .select()
          .single();

        if (error) {
          console.error('❌ Error updating system group:', error);
          throw new Error(`Failed to update system group: ${error.message}`);
        }

        console.log('✅ System group updated (limited):', data);
        return this.transformDatabaseToSystemGroup(data);
      }

      // Full updates for custom groups
      const updateData: any = {};
      
      if (groupData.name) updateData.name = groupData.name;
      if (groupData.description) updateData.description = groupData.description;
      if (groupData.permissions) updateData.permissions = groupData.permissions;
      if (groupData.color) updateData.color = this.standardizeColor(groupData.color);

      const { data, error } = await supabase
        .from('user_groups')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('❌ Error updating system group:', error);
        throw new Error(`Failed to update system group: ${error.message}`);
      }

      console.log('✅ System group updated:', data);
      return this.transformDatabaseToSystemGroup(data);
    } catch (error) {
      console.error('❌ Exception updating system group:', error);
      throw error;
    }
  }

  static async deleteSystemGroup(id: string): Promise<void> {
    try {
      // Database-level protection: Check if this is a system role
      const isSystemRole = await this.isSystemRole(id);
      if (isSystemRole) {
        throw new Error('System roles cannot be deleted. This action is not permitted.');
      }

      // Check if any users are assigned to this group
      const { data: usersWithGroup, error: usersError } = await supabase
        .from('users')
        .select('id, name')
        .eq('role', await this.getGroupNameById(id));

      if (usersError) {
        console.error('❌ Error checking user assignments:', usersError);
        throw new Error('Failed to verify user assignments before deletion');
      }

      if (usersWithGroup && usersWithGroup.length > 0) {
        throw new Error(`Cannot delete group: ${usersWithGroup.length} users are still assigned to this group. Please reassign them first.`);
      }

      const { error } = await supabase
        .from('user_groups')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('❌ Error deleting system group:', error);
        throw new Error(`Failed to delete system group: ${error.message}`);
      }

      console.log('✅ System group deleted:', id);
    } catch (error) {
      console.error('❌ Exception deleting system group:', error);
      throw error;
    }
  }

  // Helper method to check if a group is a system role
  private static async isSystemRole(id: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('user_groups')
        .select('name')
        .eq('id', id)
        .single();

      if (error || !data) {
        return false;
      }

      // Check if the group name matches any of the default system groups
      return DEFAULT_SYSTEM_GROUPS.some(systemGroup => systemGroup.name === data.name);
    } catch (error) {
      console.error('❌ Error checking if group is system role:', error);
      return false;
    }
  }

  // Helper method to get group name by id
  private static async getGroupNameById(id: string): Promise<string | null> {
    try {
      const { data, error } = await supabase
        .from('user_groups')
        .select('name')
        .eq('id', id)
        .single();

      if (error || !data) {
        return null;
      }

      return data.name;
    } catch (error) {
      console.error('❌ Error getting group name:', error);
      return null;
    }
  }

  private static standardizeColor(color: string): string {
    // Convert any color format to hex
    if (color.startsWith('#')) {
      return color;
    }
    
    // Convert common CSS classes to hex colors
    const colorMap: Record<string, string> = {
      'bg-red-100 text-red-800': '#dc2626',
      'bg-blue-100 text-blue-800': '#3b82f6',
      'bg-green-100 text-green-800': '#059669',
      'bg-orange-100 text-orange-800': '#ea580c',
      'bg-gray-100 text-gray-800': '#6b7280',
    };

    return colorMap[color] || '#3b82f6'; // Default to blue
  }

  private static async ensureDefaultGroupsExist(): Promise<void> {
    try {
      for (const group of DEFAULT_SYSTEM_GROUPS) {
        const { data: existing } = await supabase
          .from('user_groups')
          .select('id')
          .eq('name', group.name)
          .single();
          
        if (!existing) {
          console.log(`🔄 Creating missing group: ${group.name}`);
          const { error } = await supabase
            .from('user_groups')
            .insert({
              id: group.id,
              name: group.name,
              description: group.description,
              permissions: group.permissions,
              color: group.color,
            });
          
          if (error) {
            console.error(`❌ Error creating group ${group.name}:`, error);
          } else {
            console.log(`✅ Created group: ${group.name}`);
          }
        }
      }
    } catch (error) {
      console.error('❌ Exception ensuring default groups exist:', error);
    }
  }

  private static async createDefaultGroups(): Promise<void> {
    try {
      console.log('🔄 Creating default system groups...');
      for (const group of DEFAULT_SYSTEM_GROUPS) {
        await this.createSystemGroup(group);
      }
    } catch (error) {
      console.error('❌ Exception creating default groups:', error);
    }
  }

  private static transformDatabaseToSystemGroups(data: any[]): SystemGroup[] {
    return data.map(this.transformDatabaseToSystemGroup);
  }

  private static transformDatabaseToSystemGroup(data: any): SystemGroup {
    return {
      id: data.id,
      name: data.name,
      description: data.description,
      permissions: Array.isArray(data.permissions) ? data.permissions : [],
      color: data.color,
      isSystemRole: DEFAULT_SYSTEM_GROUPS.some(g => g.name === data.name),
    };
  }
}
