
import { useCallback } from 'react';
import { Van } from '@/types/van';

export const useSelectiveUpdate = () => {
  const compareAndEditData = useCallback(async (
    currentData: Van[],
    newData: Van[],
    updateCallback: (updatedItems: Van[]) => void
  ) => {
    console.log('🔍 Starting selective comparison and edit...');
    
    const updatedItems: Van[] = [];
    const dataMap = new Map(currentData.map(item => [item.id, item]));
    
    newData.forEach(newItem => {
      const existingItem = dataMap.get(newItem.id);
      
      if (!existingItem) {
        // New item - add completely
        updatedItems.push(newItem);
        console.log('➕ New van added:', newItem.license_plate);
      } else {
        // Compare field by field and create updated item with only changed fields
        const updatedItem = { ...existingItem };
        let hasChanges = false;
        const changedFields: string[] = [];
        
        // Check each field for changes
        Object.keys(newItem).forEach(key => {
          const newValue = (newItem as any)[key];
          const existingValue = (existingItem as any)[key];
          
          if (JSON.stringify(newValue) !== JSON.stringify(existingValue)) {
            (updatedItem as any)[key] = newValue;
            hasChanges = true;
            changedFields.push(key);
          }
        });
        
        if (hasChanges) {
          updatedItems.push(updatedItem);
          console.log(`✏️ Van ${existingItem.license_plate} updated - changed fields:`, changedFields);
        }
      }
    });
    
    if (updatedItems.length > 0) {
      // Create final data array with selective updates
      const finalData = currentData.map(item => {
        const updatedItem = updatedItems.find(updated => updated.id === item.id);
        return updatedItem || item;
      });
      
      // Add any completely new items
      const existingIds = new Set(currentData.map(item => item.id));
      const newItems = newData.filter(item => !existingIds.has(item.id));
      finalData.push(...newItems);
      
      console.log('✅ Selective update completed:', {
        totalItems: finalData.length,
        updatedItems: updatedItems.length,
        newItems: newItems.length
      });
      
      updateCallback(finalData);
      return { hasChanges: true, updatedCount: updatedItems.length };
    } else {
      console.log('📊 No changes detected during comparison');
      return { hasChanges: false, updatedCount: 0 };
    }
  }, []);
  
  return { compareAndEditData };
};
