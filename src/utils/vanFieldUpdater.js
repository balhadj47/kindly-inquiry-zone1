/**
 * Selective field updater for van data
 * Updates only changed fields while preserving unchanged objects
 */

export const updateVanFields = (currentVans, newVans, setVans) => {
  console.log('🔄 updateVanFields: Starting selective field update...');
  console.log('Current vans:', currentVans?.length || 0);
  console.log('New vans:', newVans?.length || 0);

  // If no current data, just set the new data
  if (!currentVans || currentVans.length === 0) {
    console.log('🔄 updateVanFields: No current data, setting new data');
    setVans(newVans || []);
    return;
  }

  // If no new data, keep current
  if (!newVans || newVans.length === 0) {
    console.log('🔄 updateVanFields: No new data, keeping current');
    return;
  }

  // Create a map of current vans by ID for fast lookup
  const currentVansMap = new Map();
  currentVans.forEach(van => {
    if (van?.id) {
      currentVansMap.set(van.id, van);
    }
  });

  const updatedVans = [];
  let hasChanges = false;

  // Process each new van
  newVans.forEach(newVan => {
    if (!newVan?.id) {
      updatedVans.push(newVan);
      return;
    }

    const currentVan = currentVansMap.get(newVan.id);
    
    if (!currentVan) {
      // New van that doesn't exist in current data
      console.log('🆕 updateVanFields: New van found:', newVan.license_plate);
      updatedVans.push(newVan);
      hasChanges = true;
      return;
    }

    // Compare fields and update only changed ones
    const updatedVan = { ...currentVan };
    let vanChanged = false;

    const fieldsToCheck = [
      'license_plate',
      'model', 
      'reference_code',
      'driver_id',
      'status',
      'insurer',
      'insurance_date',
      'control_date',
      'notes',
      'created_at',
      'updated_at'
    ];

    fieldsToCheck.forEach(field => {
      if (newVan[field] !== currentVan[field]) {
        console.log(`🔄 updateVanFields: Field ${field} changed for van ${newVan.license_plate}: "${currentVan[field]}" → "${newVan[field]}"`);
        updatedVan[field] = newVan[field];
        vanChanged = true;
        hasChanges = true;
      }
    });

    if (vanChanged) {
      console.log('✅ updateVanFields: Van updated:', newVan.license_plate);
    }

    updatedVans.push(updatedVan);
    currentVansMap.delete(newVan.id);
  });

  // Handle removed vans (exists in current but not in new)
  currentVansMap.forEach(removedVan => {
    console.log('🗑️ updateVanFields: Van removed:', removedVan.license_plate);
    hasChanges = true;
  });

  // Only update state if there are actual changes
  if (hasChanges) {
    console.log('✅ updateVanFields: Changes detected, updating state');
    setVans(updatedVans);
  } else {
    console.log('📋 updateVanFields: No changes detected, keeping current state');
  }
};

export const shouldRefreshVans = (currentVans, serverVans) => {
  // Always refresh if no current data
  if (!currentVans || currentVans.length === 0) {
    return true;
  }

  // Always refresh if server data is available
  if (serverVans && serverVans.length > 0) {
    return true;
  }

  return false;
};
