import { useCallback } from 'react';

export const useInPlaceUpdate = <T extends { id: string }>() => {
  const updateInPlace = useCallback((
    currentData: T[],
    newData: T[],
    updateCallback: (updatedItems: T[]) => void
  ) => {
    console.log('🔄 In-place update: Comparing data...');
    
    let hasAnyChanges = false;
    const currentMap = new Map(currentData.map(item => [item.id, item]));
    const newMap = new Map(newData.map(item => [item.id, item]));
    
    // Create a new array but preserve unchanged object references
    const updatedData = currentData.map(currentItem => {
      const newItem = newMap.get(currentItem.id);
      
      if (!newItem) {
        // Item was removed - this shouldn't happen often
        return currentItem;
      }
      
      // Check if item has actually changed
      const hasChanges = Object.keys(newItem).some(key => {
        const newValue = (newItem as any)[key];
        const currentValue = (currentItem as any)[key];
        return JSON.stringify(newValue) !== JSON.stringify(currentValue);
      });
      
      if (hasChanges) {
        console.log(`🔄 Item ${currentItem.id} has changes, updating...`);
        hasAnyChanges = true;
        return { ...newItem }; // Return updated item
      }
      
      // No changes - return the exact same object reference
      return currentItem;
    });
    
    // Add any completely new items
    const currentIds = new Set(currentData.map(item => item.id));
    const newItems = newData.filter(item => !currentIds.has(item.id));
    
    if (newItems.length > 0) {
      console.log(`➕ Adding ${newItems.length} new items`);
      updatedData.push(...newItems);
      hasAnyChanges = true;
    }
    
    if (hasAnyChanges) {
      console.log('✅ In-place update completed with changes');
      updateCallback(updatedData);
    } else {
      console.log('📊 No changes detected - preserving current state');
    }
    
    return { hasChanges: hasAnyChanges };
  }, []);
  
  return { updateInPlace };
};
