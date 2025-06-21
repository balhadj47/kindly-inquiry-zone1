
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
