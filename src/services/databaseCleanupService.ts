
import { supabase } from '@/integrations/supabase/client';
import { DEFAULT_SYSTEM_GROUPS } from '@/types/systemGroups';

export class DatabaseCleanupService {
  
  static async cleanupUserGroups(): Promise<void> {
    console.log('🧹 Starting user groups cleanup...');
    
    try {
      // 1. First, get all existing groups
      const { data: existingGroups, error: fetchError } = await supabase
        .from('user_groups')
        .select('*');

      if (fetchError) {
        console.error('❌ Error fetching existing groups:', fetchError);
        return;
      }

      console.log('📊 Found existing groups:', existingGroups?.length || 0);

      // 2. Delete all existing groups to start fresh
      const { error: deleteError } = await supabase
        .from('user_groups')
        .delete()
        .neq('id', ''); // Delete all records

      if (deleteError) {
        console.error('❌ Error deleting existing groups:', deleteError);
        return;
      }

      console.log('🗑️ Deleted all existing groups');

      // 3. Insert clean default system groups
      for (const group of DEFAULT_SYSTEM_GROUPS) {
        const { error: insertError } = await supabase
          .from('user_groups')
          .insert({
            id: group.id,
            name: group.name,
            description: group.description,
            permissions: group.permissions,
            color: group.color,
            role_id: null // Remove unused field
          });

        if (insertError) {
          console.error(`❌ Error inserting group ${group.name}:`, insertError);
        } else {
          console.log(`✅ Inserted clean group: ${group.name}`);
        }
      }

      console.log('✅ User groups cleanup completed successfully');
      
    } catch (error) {
      console.error('❌ Exception during cleanup:', error);
    }
  }

  static async standardizePermissionFormat(): Promise<void> {
    console.log('🔧 Standardizing permission format...');
    
    try {
      const { data: groups, error } = await supabase
        .from('user_groups')
        .select('*');

      if (error) {
        console.error('❌ Error fetching groups for permission standardization:', error);
        return;
      }

      for (const group of groups || []) {
        if (group.permissions) {
          // Convert old format permissions to new format
          const standardizedPermissions = group.permissions.map((permission: string) => {
            // Convert old dot notation to colon notation
            if (permission.includes('.')) {
              return permission.replace('.', ':');
            }
            return permission;
          });

          const { error: updateError } = await supabase
            .from('user_groups')
            .update({ permissions: standardizedPermissions })
            .eq('id', group.id);

          if (updateError) {
            console.error(`❌ Error updating permissions for ${group.name}:`, updateError);
          } else {
            console.log(`✅ Standardized permissions for: ${group.name}`);
          }
        }
      }
      
      console.log('✅ Permission format standardization completed');
      
    } catch (error) {
      console.error('❌ Exception during permission standardization:', error);
    }
  }

  static async verifyCleanup(): Promise<void> {
    console.log('🔍 Verifying cleanup results...');
    
    try {
      const { data: groups, error } = await supabase
        .from('user_groups')
        .select('*');

      if (error) {
        console.error('❌ Error verifying cleanup:', error);
        return;
      }

      console.log('📊 Groups after cleanup:', {
        total: groups?.length || 0,
        groups: groups?.map(g => ({ id: g.id, name: g.name, permissions: g.permissions?.length }))
      });

      // Check for duplicates
      const names = groups?.map(g => g.name) || [];
      const duplicates = names.filter((name, index) => names.indexOf(name) !== index);
      
      if (duplicates.length > 0) {
        console.warn('⚠️ Found duplicate group names:', duplicates);
      } else {
        console.log('✅ No duplicate groups found');
      }

      // Verify permission format
      const invalidPermissions = groups?.flatMap(g => 
        g.permissions?.filter((p: string) => p.includes('.')) || []
      ) || [];
      
      if (invalidPermissions.length > 0) {
        console.warn('⚠️ Found old permission format:', invalidPermissions);
      } else {
        console.log('✅ All permissions use new format');
      }
      
    } catch (error) {
      console.error('❌ Exception during verification:', error);
    }
  }

  static async runFullCleanup(): Promise<void> {
    console.log('🚀 Starting full database cleanup...');
    
    await this.cleanupUserGroups();
    await this.standardizePermissionFormat();
    await this.verifyCleanup();
    
    console.log('🎉 Full database cleanup completed');
  }
}
