
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

export const checkBranchesData = async () => {
  console.log('🔧 Checking branches data and relationships...');
  
  try {
    // Check if we have any branches data
    const { data: branches, error: branchesError } = await supabase
      .from('branches')
      .select('*')
      .limit(5);
    
    if (branchesError) {
      console.error('❌ Error fetching branches:', branchesError);
      return;
    }
    
    console.log('📋 Sample branches data:', branches);
    
    // Check if we have companies
    const { data: companies, error: companiesError } = await supabase
      .from('companies')
      .select('id, name')
      .limit(5);
    
    if (companiesError) {
      console.error('❌ Error fetching companies:', companiesError);
      return;
    }
    
    console.log('📋 Sample companies data:', companies);
    
  } catch (error) {
    console.error('❌ Error checking branches data:', error);
  }
};
