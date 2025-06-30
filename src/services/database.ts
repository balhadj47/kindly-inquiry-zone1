import { supabase, requireAuth } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type Tables = Database['public']['Tables'];
type Companies = Tables['companies']['Row'];
type Branches = Tables['branches']['Row'];
type Users = Tables['users']['Row'];
type Vans = Tables['vans']['Row'];
type Trips = Tables['trips']['Row'];
type UserGroups = Tables['user_groups']['Row'];

export class DatabaseService {
  // Companies
  static async getCompanies() {
    await requireAuth();
    
    console.log('🔍 DatabaseService: Attempting to fetch companies with branches');
    const { data, error } = await supabase
      .from('companies')
      .select(`
        *,
        branches (
          id,
          name,
          company_id,
          created_at,
          address,
          phone,
          email
        )
      `)
      .order('name');
    
    if (error) {
      console.error('🔍 DatabaseService: Companies fetch error:', error);
      throw error;
    }
    
    console.log('🔍 DatabaseService: Companies fetched successfully:', {
      companiesCount: data?.length || 0,
      totalBranches: data?.reduce((sum, company) => sum + (company.branches?.length || 0), 0) || 0,
      companiesWithBranches: data?.map(c => ({
        name: c.name,
        branchCount: c.branches?.length || 0
      })) || []
    });
    
    return data;
  }

  static async createCompany(company: Tables['companies']['Insert']) {
    await requireAuth();
    
    console.log('🔍 DatabaseService: Attempting to create company');
    const { data, error }= await supabase
      .from('companies')
      .insert(company)
      .select()
      .single();
    
    if (error) {
      console.error('🔍 DatabaseService: Company creation error:', error);
      throw error;
    }
    
    console.log('🔍 DatabaseService: Company created successfully');
    return data;
  }

  static async updateCompany(id: string, updates: Tables['companies']['Update']) {
    await requireAuth();
    
    console.log('🔍 DatabaseService: Attempting to update company:', id);
    const { data, error } = await supabase
      .from('companies')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('🔍 DatabaseService: Company update error:', error);
      throw error;
    }
    
    console.log('🔍 DatabaseService: Company updated successfully');
    return data;
  }

  static async deleteCompany(id: string) {
    await requireAuth();
    
    console.log('🔍 DatabaseService: Attempting to delete company:', id);
    const { error } = await supabase
      .from('companies')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('🔍 DatabaseService: Company deletion error:', error);
      throw error;
    }
    
    console.log('🔍 DatabaseService: Company deleted successfully');
  }

  // Branches
  static async getBranches(companyId?: string) {
    await requireAuth();
    
    console.log('🔍 DatabaseService: Attempting to fetch branches');
    let query = supabase.from('branches').select('*');
    
    if (companyId) {
      query = query.eq('company_id', companyId);
    }
    
    const { data, error } = await query.order('name');
    if (error) {
      console.error('🔍 DatabaseService: Branches fetch error:', error);
      throw error;
    }
    
    console.log('🔍 DatabaseService: Branches fetched successfully:', data?.length || 0, 'items');
    return data;
  }

  static async createBranch(branch: Tables['branches']['Insert']) {
    await requireAuth();
    
    console.log('🔍 DatabaseService: Attempting to create branch');
    const { data, error } = await supabase
      .from('branches')
      .insert(branch)
      .select()
      .single();
    
    if (error) {
      console.error('🔍 DatabaseService: Branch creation error:', error);
      throw error;
    }
    
    console.log('🔍 DatabaseService: Branch created successfully');
    return data;
  }

  // Users
  static async getUsers() {
    await requireAuth();
    
    console.log('🔍 DatabaseService: Attempting to fetch users');
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('name');
    
    if (error) {
      console.error('🔍 DatabaseService: Users fetch error:', error);
      throw error;
    }
    
    console.log('🔍 DatabaseService: Users fetched successfully:', data?.length || 0, 'items');
    return data;
  }

  static async getCurrentUser() {
    await requireAuth();
    
    console.log('🔍 DatabaseService: Attempting to fetch current user');
    const { data, error } = await supabase
      .rpc('get_current_user_rbac');
    
    if (error) {
      console.error('🔍 DatabaseService: Current user fetch error:', error);
      throw error;
    }
    
    console.log('🔍 DatabaseService: Current user fetched successfully:', data?.[0] || 'none');
    return data?.[0] || null;
  }

  // Vans
  static async getVans() {
    await requireAuth();
    
    console.log('🔍 DatabaseService: Attempting to fetch vans');
    const { data, error } = await supabase
      .from('vans')
      .select('*')
      .order('reference_code');
    
    if (error) {
      console.error('🔍 DatabaseService: Vans fetch error:', error);
      throw error;
    }
    
    console.log('🔍 DatabaseService: Vans fetched successfully:', data?.length || 0, 'items');
    return data;
  }

  static async createVan(van: Tables['vans']['Insert']) {
    await requireAuth();
    
    console.log('🔍 DatabaseService: Attempting to create van');
    const { data, error } = await supabase
      .from('vans')
      .insert(van)
      .select()
      .single();
    
    if (error) {
      console.error('🔍 DatabaseService: Van creation error:', error);
      throw error;
    }
    
    console.log('🔍 DatabaseService: Van created successfully');
    return data;
  }

  // Trips
  static async getTrips() {
    await requireAuth();
    
    console.log('🔍 DatabaseService: Attempting to fetch trips');
    const { data, error } = await supabase
      .from('trips')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('🔍 DatabaseService: Trips fetch error:', error);
      throw error;
    }
    
    console.log('🔍 DatabaseService: Trips fetched successfully:', data?.length || 0, 'items');
    return data;
  }

  static async createTrip(trip: Tables['trips']['Insert']) {
    await requireAuth();
    
    console.log('🔍 DatabaseService: Attempting to create trip');
    const { data, error } = await supabase
      .from('trips')
      .insert(trip)
      .select()
      .single();
    
    if (error) {
      console.error('🔍 DatabaseService: Trip creation error:', error);
      throw error;
    }
    
    console.log('🔍 DatabaseService: Trip created successfully');
    return data;
  }

  // User Groups
  static async getUserGroups() {
    await requireAuth();
    
    console.log('🔍 DatabaseService: Attempting to fetch user groups');
    const { data, error } = await supabase
      .from('user_groups')
      .select('*')
      .order('name');
    
    if (error) {
      console.error('🔍 DatabaseService: User groups fetch error:', error);
      throw error;
    }
    
    console.log('🔍 DatabaseService: User groups fetched successfully:', data?.length || 0, 'items');
    return data;
  }
}
