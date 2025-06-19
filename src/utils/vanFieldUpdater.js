
/**
 * Simplified van data updater - direct approach
 */

export const updateVanFields = (serverVans, setLocalVans) => {
  console.log('🔄 updateVanFields: Direct update with server data');
  console.log('Server vans:', serverVans?.length || 0);

  // Direct update - no complex logic
  if (serverVans && Array.isArray(serverVans)) {
    setLocalVans(serverVans);
    console.log('✅ updateVanFields: Data updated directly');
  } else {
    setLocalVans([]);
    console.log('🔄 updateVanFields: Set empty array');
  }
};
