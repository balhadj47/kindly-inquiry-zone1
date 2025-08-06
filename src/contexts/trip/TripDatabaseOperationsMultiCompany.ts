
import { supabase, requireAuth } from '@/integrations/supabase/client';
import { UserWithRoles } from './types';
import { SelectedCompany } from '@/hooks/useTripFormMultiCompany';

export const insertTripWithMultipleCompanies = async (tripData: {
  van: string;
  driver: string;
  companies: SelectedCompany[];
  notes: string;
  userIds: string[];
  userRoles: UserWithRoles[];
  startKm?: number;
  startDate?: Date;
  endDate?: Date;
}) => {
  // Require authentication
  await requireAuth();
  
  console.log('Inserting trip with multiple companies:', tripData);

  // Start a transaction to insert trip and associated companies
  const { data: trip, error: tripError } = await supabase
    .from('trips')
    .insert({
      van: tripData.van,
      driver: tripData.driver,
      // Store first company for backward compatibility
      company: tripData.companies[0]?.companyId || '',
      branch: tripData.companies[0]?.branchId || '',
      notes: tripData.notes,
      user_ids: tripData.userIds,
      user_roles: tripData.userRoles || [],
      start_km: tripData.startKm,
      planned_start_date: tripData.startDate?.toISOString(),
      planned_end_date: tripData.endDate?.toISOString(),
      companies_data: tripData.companies, // Store all companies as JSON
      status: 'active',
    })
    .select()
    .single();

  if (tripError) {
    console.error('Insert trip error:', tripError);
    throw tripError;
  }

  // Insert trip-company relationships
  if (tripData.companies.length > 0) {
    const tripCompanyInserts = tripData.companies.map(company => ({
      trip_id: trip.id,
      company_id: company.companyId,
      branch_id: company.branchId
    }));

    const { error: tripCompaniesError } = await supabase
      .from('trip_companies')
      .insert(tripCompanyInserts);

    if (tripCompaniesError) {
      console.error('Insert trip companies error:', tripCompaniesError);
      // Don't throw here as the trip was created successfully
      console.warn('Trip created but company associations may have failed');
    }
  }

  // Update van status to "En Transit"
  const { error: vanError } = await supabase
    .from('vans')
    .update({ status: 'En Transit' })
    .eq('id', tripData.van);

  if (vanError) {
    console.error('Update van status error:', vanError);
    // Don't throw here, trip was created successfully
  }

  console.log('Trip with multiple companies added successfully:', trip);
  
  return trip;
};
