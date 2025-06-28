
import { supabase } from '@/integrations/supabase/client';
import { SystemGroup } from '@/types/systemGroups';

export class SystemGroupsService {
  static async loadSystemGroups(): Promise<SystemGroup[]> {
    try {
      console.log('🔄 Loading system groups from database...');
      
      const { data, error } = await supabase
        .from('user_groups')
        .select('*')
        .order('role_id', { ascending: true });

      if (error) {
        console.error('❌ Error loading system groups:', error);
        return [];
      }

      if (!data || data.length === 0) {
        console.log('📝 No groups found in database');
        return [];
      }

      const groups = this.transformDatabaseToSystemGroups(data);
      console.log('✅ System groups loaded:', groups.length);
      return groups;
    } catch (error) {
      console.error('❌ Exception loading system groups:', error);
      return [];
    }
  }

  static async createSystemGroup(groupData: Partial<SystemGroup>): Promise<SystemGroup> {
    try {
      const newGroup = {
        id: groupData.id || Math.random().toString(36).substr(2, 9),
        name: groupData.name || 'Employee',
        description: groupData.description || '',
        permissions: groupData.permissions || [],
        color: this.standardizeColor(groupData.color || '#3b82f6'),
        role_id: groupData.role_id || 3,
      };

      const { data, error } = await supabase
        .from('user_groups')
        .insert(newGroup)
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
      const updateData: Record<string, any> = {};
      
      if (groupData.name) updateData.name = groupData.name;
      if (groupData.description) updateData.description = groupData.description;
      if (groupData.permissions) updateData.permissions = groupData.permissions;
      if (groupData.color) updateData.color = this.standardizeColor(groupData.color);
      if (groupData.role_id) updateData.role_id = groupData.role_id;

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
      // Check if any users are assigned to this group
      const { data: usersWithGroup, error: usersError } = await supabase
        .from('users')
        .select('id, name, role_id')
        .eq('role_id', await this.getRoleIdByGroupId(id));

      if (usersError) {
        console.error('❌ Error checking user assignments:', usersError);
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

  // Helper method to get role_id by group id
  private static async getRoleIdByGroupId(groupId: string): Promise<number> {
    try {
      const { data, error } = await supabase
        .from('user_groups')
        .select('role_id')
        .eq('id', groupId)
        .single();

      if (error || !data) {
        return 3; // Default to employee
      }

      return data.role_id || 3;
    } catch (error) {
      console.error('❌ Error getting role_id for group:', error);
      return 3;
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
      role_id: data.role_id,
      isSystemRole: false, // All groups are now custom since we don't have hardcoded ones
    };
  }
}
