
import { supabase, requireAuth } from '@/integrations/supabase/client';
import { clearTripCache } from '../TripCacheManager';

export const deleteTripFromDatabase = async (tripId: number) => {
  // Require authentication
  await requireAuth();
  
  // First get the trip to find the van ID
  const { data: tripData, error: tripError } = await (supabase as any)
    .from('trips')
    .select('van, status')
    .eq('id', tripId)
    .single();

  if (tripError) {
    console.error('Get trip error:', tripError);
    throw tripError;
  }

  // Delete the trip
  const { error } = await (supabase as any)
    .from('trips')
    .delete()
    .eq('id', tripId);

  if (error) {
    console.error('Delete trip error:', error);
    throw error;
  }

  // If the trip was active, update van status back to "Active"
  if (tripData?.van && tripData?.status === 'active') {
    const { error: vanError } = await (supabase as any)
      .from('vans')
      .update({ status: 'Active' })
      .eq('id', tripData.van);

    if (vanError) {
      console.error('Update van status error:', vanError);
      // Don't throw here, trip was deleted successfully
    }
  }

  console.log('Trip deleted successfully and van status updated:', tripId);
  
  // Clear cache to force refresh on next load
  clearTripCache();
};
