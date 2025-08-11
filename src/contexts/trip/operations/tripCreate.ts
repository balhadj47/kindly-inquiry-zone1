
import { supabase, requireAuth } from '@/integrations/supabase/client';
import { UserWithRoles } from '../types';
import { CompanyBranchSelection } from '@/types/company-selection';
import { clearTripCache } from '../TripCacheManager';

export const insertTripToDatabase = async (tripData: {
  van: string;
  driver: string;
  company: string;
  branch: string;
  notes: string;
  userIds: string[];
  userRoles: UserWithRoles[];
  startKm?: number;
  startDate?: Date;
  endDate?: Date;
  selectedCompanies?: CompanyBranchSelection[];
}) => {
  // Require authentication
  await requireAuth();
  
  console.log('Inserting trip with companies:', tripData.selectedCompanies);
  console.log('Full tripData received in insertTripToDatabase:', JSON.stringify(tripData, null, 2));

  try {
    // Prepare companies_data for storage
    const companiesData = tripData.selectedCompanies || [];
    console.log('Companies data being saved:', companiesData);

    // Start a transaction to insert trip and company relationships
    const { data: tripResult, error: tripError } = await (supabase as any)
      .from('trips')
      .insert({
        van: tripData.van,
        driver: tripData.driver,
        company: tripData.company,
        branch: tripData.branch,
        notes: tripData.notes,
        user_ids: tripData.userIds,
        user_roles: tripData.userRoles || [],
        start_km: tripData.startKm,
        planned_start_date: tripData.startDate?.toISOString(),
        planned_end_date: tripData.endDate?.toISOString(),
        status: 'active',
        companies_data: companiesData, // Store multiple companies here
      })
      .select()
      .single();

    if (tripError) {
      console.error('Insert trip error:', tripError);
      throw tripError;
    }

    console.log('Trip inserted successfully with companies_data:', tripResult);

    // Insert company relationships if provided
    if (tripData.selectedCompanies && tripData.selectedCompanies.length > 0) {
      console.log('Inserting trip companies relationships:', tripData.selectedCompanies.length, 'companies');
      const companyRelationships = tripData.selectedCompanies.map(company => ({
        trip_id: tripResult.id,
        company_id: company.companyId,
        branch_id: company.branchId
      }));

      console.log('Company relationships to insert:', companyRelationships);

      const { data: insertedRelationships, error: companiesError } = await (supabase as any)
        .from('trip_companies')
        .insert(companyRelationships)
        .select();

      if (companiesError) {
        console.error('Insert trip companies error:', companiesError);
        // Don't throw here, trip was created successfully
        console.error('Failed to insert company relationships, but trip was created');
      } else {
        console.log('Trip companies inserted successfully:', insertedRelationships);
      }
    }

    // Update van status to "En Transit"
    const { error: vanError } = await (supabase as any)
      .from('vans')
      .update({ status: 'En Transit' })
      .eq('id', tripData.van);

    if (vanError) {
      console.error('Update van status error:', vanError);
      // Don't throw here, trip was created successfully
    }

    console.log('Trip and companies added successfully, van status updated');
    
    // Clear cache to force refresh on next load
    clearTripCache();
    
    return tripResult;
  } catch (error) {
    console.error('Error in insertTripToDatabase:', error);
    throw error;
  }
};
