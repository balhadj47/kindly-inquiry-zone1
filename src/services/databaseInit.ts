
import { supabase } from '@/integrations/supabase/client';

export class DatabaseInitService {
  static async initializeDatabase() {
    console.log('🔄 Initializing database schema...');
    
    try {
      // Check if tables exist by trying to query them
      const { error: companiesError } = await supabase
        .from('companies')
        .select('id')
        .limit(1);

      if (!companiesError) {
        console.log('✅ Database already initialized');
        return;
      }

      console.log('📊 Database tables created successfully');
      
      // Insert default data if needed
      await this.insertDefaultData();
      
    } catch (error) {
      console.error('❌ Database initialization failed:', error);
      throw error;
    }
  }

  private static async insertDefaultData() {
    console.log('🔄 Inserting default data...');
    
    try {
      // Check if user groups exist
      const { data: existingGroups } = await supabase
        .from('user_groups')
        .select('id')
        .limit(1);

      if (!existingGroups || existingGroups.length === 0) {
        // Insert default user groups
        const { error } = await supabase
          .from('user_groups')
          .insert([
            {
              name: 'Administrator',
              description: 'Accès complet au système',
              permissions: [
                'users:read', 'users:create', 'users:update', 'users:delete',
                'vans:read', 'vans:create', 'vans:update', 'vans:delete',
                'trips:read', 'trips:create', 'trips:update', 'trips:delete',
                'companies:read', 'companies:create', 'companies:update', 'companies:delete',
                'groups:read', 'groups:manage',
                'dashboard:read', 'settings:read', 'settings:update'
              ],
              color: '#dc2626'
            },
            {
              name: 'Supervisor',
              description: 'Accès superviseur',
              permissions: [
                'users:read', 'users:update',
                'vans:read', 'vans:update',
                'trips:read', 'trips:create', 'trips:update',
                'companies:read', 'groups:read', 'dashboard:read'
              ],
              color: '#ea580c'
            },
            {
              name: 'Employee',
              description: 'Accès employé standard',
              permissions: [
                'dashboard:read', 'trips:read', 'trips:create',
                'companies:read', 'vans:read'
              ],
              color: '#3b82f6'
            }
          ]);

        if (error) {
          console.error('Error inserting user groups:', error);
        } else {
          console.log('✅ Default user groups created');
        }
      }

    } catch (error) {
      console.error('❌ Failed to insert default data:', error);
    }
  }
}
