/**
 * Simplified van data updater with direct refresh approach
 */

export const updateVanFields = (currentVans, newVans, setVans) => {
  console.log('🔄 updateVanFields: Starting update...');
  console.log('Current vans:', currentVans?.length || 0);
  console.log('New vans:', newVans?.length || 0);

  // Always update if we have new data
  if (newVans && Array.isArray(newVans)) {
    console.log('✅ updateVanFields: Setting new data');
    setVans(newVans);
    return;
  }

  // Fallback: keep current data if no new data
  if (!newVans && currentVans && Array.isArray(currentVans)) {
    console.log('📋 updateVanFields: No new data, keeping current');
    return;
  }

  // Default: set empty array
  console.log('🔄 updateVanFields: Setting empty array as fallback');
  setVans([]);
};

export const shouldRefreshVans = (currentVans, serverVans) => {
  // Always refresh if we have server data
  if (serverVans && Array.isArray(serverVans)) {
    return true;
  }
  
  // Refresh if no current data
  if (!currentVans || currentVans.length === 0) {
    return true;
  }

  return false;
};
