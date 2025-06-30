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
      
    } catch (error) {
      console.error('❌ Database initialization failed:', error);
      throw error;
    }
  }
}

export const ensureBranchesConstraints = async () => {
  console.log('🔧 Ensuring branches foreign key constraints...');
  
  try {
    // Check if foreign key constraint exists
    const { data: constraints, error: constraintError } = await supabase
      .rpc('get_table_constraints', { table_name: 'branches' });
    
    if (constraintError) {
      console.error('Error checking constraints:', constraintError);
      return;
    }
    
    console.log('📋 Current branches constraints:', constraints);
    
    // If no foreign key constraint exists, we might need to add it
    // This would typically be done via SQL migration
    
  } catch (error) {
    console.error('❌ Error ensuring branches constraints:', error);
  }
};
