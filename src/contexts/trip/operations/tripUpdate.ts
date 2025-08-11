
import { supabase, requireAuth } from '@/integrations/supabase/client';
import { clearTripCache } from '../TripCacheManager';

export const updateTripInDatabase = async (tripId: number, endKm: number) => {
  // Require authentication
  await requireAuth();
  
  // First get the trip to find the van ID
  const { data: tripData, error: tripError } = await (supabase as any)
    .from('trips')
    .select('van')
    .eq('id', tripId)
    .single();

  if (tripError) {
    console.error('Get trip error:', tripError);
    throw tripError;
  }

  // Update trip status
  const { error } = await (supabase as any)
    .from('trips')
    .update({
      end_km: endKm,
      status: 'completed'
    })
    .eq('id', tripId);

  if (error) {
    console.error('End trip error:', error);
    throw error;
  }

  // Update van status back to "Active"
  if (tripData?.van) {
    const { error: vanError } = await (supabase as any)
      .from('vans')
      .update({ status: 'Active' })
      .eq('id', tripData.van);

    if (vanError) {
      console.error('Update van status error:', vanError);
      // Don't throw here, trip was updated successfully
    }
  }

  console.log('Trip ended successfully and van status updated:', tripId);
  
  // Clear cache to force refresh on next load
  clearTripCache();
};
