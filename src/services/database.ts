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
    console.log('🔍 DatabaseService: Attempting to fetch companies with branches');
    
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) {
        console.log('🔍 DatabaseService: No authenticated user, cannot access companies');
        throw new Error('Authentication required');
      }
      
      console.log('🔍 DatabaseService: Authenticated user:', user.email);
      
      // Check permission using database function
      const { data: hasPermission, error: permError } = await supabase.rpc('current_user_can_read_companies');
      
      if (permError) {
        console.error('🔍 DatabaseService: Permission check failed:', permError);
        return [];
      }
      
      if (!hasPermission) {
        console.warn('🔍 DatabaseService: User does not have permission to read companies');
        return [];
      }
      
      console.log('🔍 DatabaseService: Executing companies query with branches...');
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
        
        // Handle RLS permission errors gracefully
        if (error.code === 'PGRST301' || error.message?.includes('permission')) {
          console.warn('🔍 DatabaseService: Permission denied for companies access');
          return [];
        }
        
        throw error;
      }
      
      console.log('🔍 DatabaseService: Companies fetched successfully:', {
        companiesCount: data?.length || 0,
        totalBranches: data?.reduce((sum, company) => sum + (company.branches?.length || 0), 0) || 0,
        companiesWithBranches: data?.map(c => ({
          name: c.name,
          branchCount: c.branches?.length || 0,
          branches: c.branches?.map(b => b.name) || []
        })) || []
      });
      
      return data;
    } catch (error) {
      console.error('🔍 DatabaseService: Exception in getCompanies:', error);
      throw error;
    }
  }

  static async createCompany(company: Tables['companies']['Insert']) {
    await requireAuth();
    
    console.log('🔍 DatabaseService: Attempting to create company');
    
    // Check permission using database function
    const { data: hasPermission, error: permError } = await supabase.rpc('current_user_can_create_companies');
    
    if (permError || !hasPermission) {
      console.error('🔍 DatabaseService: No permission to create companies');
      throw new Error('You do not have permission to create companies');
    }
    
    const { data, error } = await supabase
      .from('companies')
      .insert(company)
      .select()
      .single();
    
    if (error) {
      console.error('🔍 DatabaseService: Company creation error:', error);
      if (error.code === 'PGRST301' || error.message?.includes('permission')) {
        throw new Error('You do not have permission to create companies');
      }
      throw error;
    }
    
    console.log('🔍 DatabaseService: Company created successfully');
    return data;
  }

  static async updateCompany(id: string, updates: Tables['companies']['Update']) {
    await requireAuth();
    
    console.log('🔍 DatabaseService: Attempting to update company:', id);
    
    // Check permission using database function
    const { data: hasPermission, error: permError } = await supabase.rpc('current_user_can_update_companies');
    
    if (permError || !hasPermission) {
      console.error('🔍 DatabaseService: No permission to update companies');
      throw new Error('You do not have permission to update companies');
    }
    
    const { data, error } = await supabase
      .from('companies')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('🔍 DatabaseService: Company update error:', error);
      if (error.code === 'PGRST301' || error.message?.includes('permission')) {
        throw new Error('You do not have permission to update companies');
      }
      throw error;
    }
    
    console.log('🔍 DatabaseService: Company updated successfully');
    return data;
  }

  static async deleteCompany(id: string) {
    await requireAuth();
    
    console.log('🔍 DatabaseService: Attempting to delete company:', id);
    
    // Check permission using database function
    const { data: hasPermission, error: permError } = await supabase.rpc('current_user_can_delete_companies');
    
    if (permError || !hasPermission) {
      console.error('🔍 DatabaseService: No permission to delete companies');
      throw new Error('You do not have permission to delete companies');
    }
    
    const { error } = await supabase
      .from('companies')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('🔍 DatabaseService: Company deletion error:', error);
      if (error.code === 'PGRST301' || error.message?.includes('permission')) {
        throw new Error('You do not have permission to delete companies');
      }
      throw error;
    }
    
    console.log('🔍 DatabaseService: Company deleted successfully');
  }

  // Branches
  static async getBranches(companyId?: string) {
    console.log('🔍 DatabaseService: Attempting to fetch branches', companyId ? `for company ${companyId}` : 'all');
    
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) {
        console.log('🔍 DatabaseService: No authenticated user for branches');
        throw new Error('Authentication required');
      }
      
      console.log('🔍 DatabaseService: Authenticated user for branches:', user.email);
      
      let query = supabase.from('branches').select('*');
      
      if (companyId) {
        query = query.eq('company_id', companyId);
      }
      
      const { data, error } = await query.order('name');
      if (error) {
        console.error('🔍 DatabaseService: Branches fetch error:', error);
        if (error.code === 'PGRST301' || error.message?.includes('permission')) {
          console.warn('🔍 DatabaseService: Permission denied for branches access');
          return [];
        }
        throw error;
      }
      
      console.log('🔍 DatabaseService: Branches fetched successfully:', {
        count: data?.length || 0,
        companyId: companyId || 'all',
        branches: data
      });
      return data;
    } catch (error) {
      console.error('🔍 DatabaseService: Exception in getBranches:', error);
      throw error;
    }
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
      if (error.code === 'PGRST301' || error.message?.includes('permission')) {
        throw new Error('You do not have permission to create branches');
      }
      throw error;
    }
    
    console.log('🔍 DatabaseService: Branch created successfully');
    return data;
  }

  // Users
  static async getUsers() {
    console.log('🔍 DatabaseService: Attempting to fetch users');
    
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) {
        console.log('🔍 DatabaseService: No authenticated user for users');
        throw new Error('Authentication required');
      }
      
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('name');
      
      if (error) {
        console.error('🔍 DatabaseService: Users fetch error:', error);
        if (error.code === 'PGRST301' || error.message?.includes('permission')) {
          console.warn('🔍 DatabaseService: Permission denied for users access');
          return [];
        }
        throw error;
      }
      
      console.log('🔍 DatabaseService: Users fetched successfully:', data?.length || 0, 'items');
      return data;
    } catch (error) {
      console.error('🔍 DatabaseService: Exception in getUsers:', error);
      throw error;
    }
  }

  static async getCurrentUser() {
    console.log('🔍 DatabaseService: Attempting to fetch current user');
    
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) {
        console.log('🔍 DatabaseService: No authenticated user for getCurrentUser');
        return null;
      }
      
      const { data, error } = await supabase
        .rpc('get_current_user_rbac');
      
      if (error) {
        console.error('🔍 DatabaseService: Current user fetch error:', error);
        if (error.code === 'PGRST301' || error.message?.includes('permission')) {
          console.warn('🔍 DatabaseService: Permission denied for current user access');
          return null;
        }
        throw error;
      }
      
      console.log('🔍 DatabaseService: Current user fetched successfully:', data?.[0] || 'none');
      return data?.[0] || null;
    } catch (error) {
      console.error('🔍 DatabaseService: Exception in getCurrentUser:', error);
      return null;
    }
  }

  // Vans
  static async getVans() {
    console.log('🔍 DatabaseService: Attempting to fetch vans');
    
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) {
        console.log('🔍 DatabaseService: No authenticated user for vans');
        throw new Error('Authentication required');
      }
      
      const { data, error } = await supabase
        .from('vans')
        .select('*')
        .order('reference_code');
      
      if (error) {
        console.error('🔍 DatabaseService: Vans fetch error:', error);
        if (error.code === 'PGRST301' || error.message?.includes('permission')) {
          console.warn('🔍 DatabaseService: Permission denied for vans access');
          return [];
        }
        throw error;
      }
      
      console.log('🔍 DatabaseService: Vans fetched successfully:', data?.length || 0, 'items');
      return data;
    } catch (error) {
      console.error('🔍 DatabaseService: Exception in getVans:', error);
      throw error;
    }
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
      if (error.code === 'PGRST301' || error.message?.includes('permission')) {
        throw new Error('You do not have permission to create vans');
      }
      throw error;
    }
    
    console.log('🔍 DatabaseService: Van created successfully');
    return data;
  }

  // Trips
  static async getTrips() {
    console.log('🔍 DatabaseService: Attempting to fetch trips');
    
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) {
        console.log('🔍 DatabaseService: No authenticated user for trips');
        throw new Error('Authentication required');
      }
      
      const { data, error } = await supabase
        .from('trips')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('🔍 DatabaseService: Trips fetch error:', error);
        if (error.code === 'PGRST301' || error.message?.includes('permission')) {
          console.warn('🔍 DatabaseService: Permission denied for trips access');
          return [];
        }
        throw error;
      }
      
      console.log('🔍 DatabaseService: Trips fetched successfully:', data?.length || 0, 'items');
      return data;
    } catch (error) {
      console.error('🔍 DatabaseService: Exception in getTrips:', error);
      throw error;
    }
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
      if (error.code === 'PGRST301' || error.message?.includes('permission')) {
        throw new Error('You do not have permission to create trips');
      }
      throw error;
    }
    
    console.log('🔍 DatabaseService: Trip created successfully');
    return data;
  }

  // User Groups with secure permissions structure
  static async getUserGroups() {
    console.log('🔍 DatabaseService: Attempting to fetch user groups with permissions');
    
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) {
        console.log('🔍 DatabaseService: No authenticated user for user groups');
        throw new Error('Authentication required');
      }
      
      // Fetch user groups with both array and relational permissions
      const { data: groups, error: groupsError } = await supabase
        .from('user_groups')
        .select(`
          *,
          role_permissions!left(
            permissions!inner(
              id,
              name,
              description,
              category
            )
          )
        `)
        .order('name');
      
      if (groupsError) {
        console.error('🔍 DatabaseService: User groups fetch error:', groupsError);
        if (groupsError.code === 'PGRST301' || groupsError.message?.includes('permission')) {
          console.warn('🔍 DatabaseService: Permission denied for user groups access');
          return [];
        }
        throw groupsError;
      }

      // Combine array permissions and relational permissions
      const groupsWithPermissions = (groups || []).map(group => {
        const arrayPermissions = group.permissions || [];
        const relationalPermissions = group.role_permissions?.map((rp: any) => rp.permissions.name) || [];
        const allPermissions = [...new Set([...arrayPermissions, ...relationalPermissions])];
        
        return {
          ...group,
          permissions: allPermissions
        };
      });
      
      console.log('🔍 DatabaseService: User groups with permissions fetched successfully:', groupsWithPermissions.length, 'items');
      return groupsWithPermissions;
    } catch (error) {
      console.error('🔍 DatabaseService: Exception in getUserGroups:', error);
      throw error;
    }
  }

  // Get all available permissions using secure access
  static async getPermissions() {
    console.log('🔍 DatabaseService: Attempting to fetch permissions');
    
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) {
        console.log('🔍 DatabaseService: No authenticated user for permissions');
        throw new Error('Authentication required');
      }
      
      const { data: permissions, error: permError } = await supabase
        .from('permissions')
        .select('*')
        .order('category', { ascending: true })
        .order('name', { ascending: true });
      
      if (permError) {
        console.error('🔍 DatabaseService: Permissions fetch error:', permError);
        if (permError.code === 'PGRST301' || permError.message?.includes('permission')) {
          console.warn('🔍 DatabaseService: Permission denied for permissions access');
          return [];
        }
        throw permError;
      }
      
      console.log('🔍 DatabaseService: Permissions fetched successfully:', permissions?.length || 0, 'items');
      return permissions || [];
    } catch (error) {
      console.error('🔍 DatabaseService: Exception in getPermissions:', error);
      throw error;
    }
  }

  // Get permissions by category using secure access
  static async getPermissionsByCategory(category: string) {
    console.log('🔍 DatabaseService: Attempting to fetch permissions by category:', category);
    
    try {
      const { data: permissions, error: permError } = await supabase
        .from('permissions')
        .select('*')
        .eq('category', category)
        .order('name', { ascending: true });
      
      if (permError) {
        console.error('🔍 DatabaseService: Permissions by category fetch error:', permError);
        if (permError.code === 'PGRST301' || permError.message?.includes('permission')) {
          console.warn('🔍 DatabaseService: Permission denied for permissions by category access');
          return [];
        }
        throw permError;
      }
      
      console.log('🔍 DatabaseService: Permissions by category fetched successfully:', permissions?.length || 0, 'items');
      return permissions || [];
    } catch (error) {
      console.error('🔍 DatabaseService: Exception in getPermissionsByCategory:', error);
      throw error;
    }
  }

  // Vans
  static async getVans() {
    console.log('🔍 DatabaseService: Attempting to fetch vans');
    
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) {
        console.log('🔍 DatabaseService: No authenticated user for vans');
        throw new Error('Authentication required');
      }
      
      const { data, error } = await supabase
        .from('vans')
        .select('*')
        .order('reference_code');
      
      if (error) {
        console.error('🔍 DatabaseService: Vans fetch error:', error);
        if (error.code === 'PGRST301' || error.message?.includes('permission')) {
          console.warn('🔍 DatabaseService: Permission denied for vans access');
          return [];
        }
        throw error;
      }
      
      console.log('🔍 DatabaseService: Vans fetched successfully:', data?.length || 0, 'items');
      return data;
    } catch (error) {
      console.error('🔍 DatabaseService: Exception in getVans:', error);
      throw error;
    }
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
      if (error.code === 'PGRST301' || error.message?.includes('permission')) {
        throw new Error('You do not have permission to create vans');
      }
      throw error;
    }
    
    console.log('🔍 DatabaseService: Van created successfully');
    return data;
  }

  // Trips
  static async getTrips() {
    console.log('🔍 DatabaseService: Attempting to fetch trips');
    
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) {
        console.log('🔍 DatabaseService: No authenticated user for trips');
        throw new Error('Authentication required');
      }
      
      const { data, error } = await supabase
        .from('trips')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('🔍 DatabaseService: Trips fetch error:', error);
        if (error.code === 'PGRST301' || error.message?.includes('permission')) {
          console.warn('🔍 DatabaseService: Permission denied for trips access');
          return [];
        }
        throw error;
      }
      
      console.log('🔍 DatabaseService: Trips fetched successfully:', data?.length || 0, 'items');
      return data;
    } catch (error) {
      console.error('🔍 DatabaseService: Exception in getTrips:', error);
      throw error;
    }
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
      if (error.code === 'PGRST301' || error.message?.includes('permission')) {
        throw new Error('You do not have permission to create trips');
      }
      throw error;
    }
    
    console.log('🔍 DatabaseService: Trip created successfully');
    return data;
  }
}
