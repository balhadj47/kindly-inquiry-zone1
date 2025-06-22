
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
    const { data, error } = await supabase
      .from('companies')
      .select(`
        *,
        branches (*)
      `)
      .order('name');
    
    if (error) throw error;
    return data;
  }

  static async createCompany(company: Tables['companies']['Insert']) {
    await requireAuth();
    const { data, error }= await supabase
      .from('companies')
      .insert(company)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  static async updateCompany(id: string, updates: Tables['companies']['Update']) {
    await requireAuth();
    const { data, error } = await supabase
      .from('companies')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  static async deleteCompany(id: string) {
    await requireAuth();
    const { error } = await supabase
      .from('companies')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }

  // Branches
  static async getBranches(companyId?: string) {
    await requireAuth();
    let query = supabase.from('branches').select('*');
    
    if (companyId) {
      query = query.eq('company_id', companyId);
    }
    
    const { data, error } = await query.order('name');
    if (error) throw error;
    return data;
  }

  static async createBranch(branch: Tables['branches']['Insert']) {
    await requireAuth();
    const { data, error } = await supabase
      .from('branches')
      .insert(branch)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  // Users
  static async getUsers() {
    await requireAuth();
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('name');
    
    if (error) throw error;
    return data;
  }

  static async getCurrentUser() {
    await requireAuth();
    const { data, error } = await supabase
      .rpc('get_current_user_rbac');
    
    if (error) throw error;
    return data?.[0] || null;
  }

  // Vans
  static async getVans() {
    await requireAuth();
    const { data, error } = await supabase
      .from('vans')
      .select('*')
      .order('reference_code');
    
    if (error) throw error;
    return data;
  }

  static async createVan(van: Tables['vans']['Insert']) {
    await requireAuth();
    const { data, error } = await supabase
      .from('vans')
      .insert(van)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  // Trips
  static async getTrips() {
    await requireAuth();
    const { data, error } = await supabase
      .from('trips')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  }

  static async createTrip(trip: Tables['trips']['Insert']) {
    await requireAuth();
    const { data, error } = await supabase
      .from('trips')
      .insert(trip)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  // User Groups
  static async getUserGroups() {
    await requireAuth();
    const { data, error } = await supabase
      .from('user_groups')
      .select('*')
      .order('name');
    
    if (error) throw error;
    return data;
  }
}
