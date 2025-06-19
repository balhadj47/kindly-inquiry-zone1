import { useCallback } from 'react';

export const useSelectiveDataUpdate = <T extends { id: string }>() => {
  const compareAndUpdate = useCallback((
    currentData: T[],
    newData: T[],
    updateCallback: (updatedItems: T[]) => void
  ) => {
    console.log('🔄 Comparing data for selective update...');
    
    const updatedItems: T[] = [];
    const dataMap = new Map(currentData.map(item => [item.id, item]));
    
    newData.forEach(newItem => {
      const existingItem = dataMap.get(newItem.id);
      
      if (!existingItem) {
        // New item - add it
        updatedItems.push(newItem);
        console.log('➕ New item added:', newItem.id);
      } else {
        // Check for changes by comparing each field
        const hasChanges = Object.keys(newItem).some(key => {
          const newValue = (newItem as any)[key];
          const existingValue = (existingItem as any)[key];
          return JSON.stringify(newValue) !== JSON.stringify(existingValue);
        });
        
        if (hasChanges) {
          // Create updated item with only changed fields
          const updatedItem = { ...existingItem };
          let changedFields: string[] = [];
          
          Object.keys(newItem).forEach(key => {
            const newValue = (newItem as any)[key];
            const existingValue = (existingItem as any)[key];
            
            if (JSON.stringify(newValue) !== JSON.stringify(existingValue)) {
              (updatedItem as any)[key] = newValue;
              changedFields.push(key);
            }
          });
          
          updatedItems.push(updatedItem);
          console.log(`🔄 Item ${newItem.id} updated - changed fields:`, changedFields);
        }
      }
    });
    
    // Create final data array preserving unchanged items
    const finalData = currentData.map(item => {
      const updatedItem = updatedItems.find(updated => updated.id === item.id);
      return updatedItem || item;
    });
    
    // Add any completely new items
    const newItemIds = new Set(currentData.map(item => item.id));
    const completelyNewItems = newData.filter(item => !newItemIds.has(item.id));
    finalData.push(...completelyNewItems);
    
    if (updatedItems.length > 0 || completelyNewItems.length > 0) {
      console.log('✅ Selective update completed:', {
        totalItems: finalData.length,
        updatedItems: updatedItems.length,
        newItems: completelyNewItems.length
      });
      updateCallback(finalData);
    } else {
      console.log('📊 No changes detected - skipping update');
    }
    
    return {
      hasChanges: updatedItems.length > 0 || completelyNewItems.length > 0,
      updatedCount: updatedItems.length,
      newCount: completelyNewItems.length
    };
  }, []);
  
  return { compareAndUpdate };
};
