
import { useMemo, useRef } from 'react';

export const useSmartContentUpdate = <T>(data: T[], keyField: keyof T) => {
  const previousDataRef = useRef<Map<any, T>>(new Map());
  
  const { updatedItems, newItems, removedItems, unchangedItems } = useMemo(() => {
    const currentMap = new Map(data.map(item => [item[keyField], item]));
    const previousMap = previousDataRef.current;
    
    const updatedItems: T[] = [];
    const newItems: T[] = [];
    const unchangedItems: T[] = [];
    const removedKeys = new Set(previousMap.keys());

    // Check each current item
    data.forEach(item => {
      const key = item[keyField];
      const previousItem = previousMap.get(key);
      
      if (!previousItem) {
        // New item
        newItems.push(item);
      } else {
        // Remove from removed keys since it still exists
        removedKeys.delete(key);
        
        // Check if item has changed
        if (JSON.stringify(item) !== JSON.stringify(previousItem)) {
          updatedItems.push(item);
        } else {
          unchangedItems.push(item);
        }
      }
    });

    const removedItems = Array.from(removedKeys).map(key => previousMap.get(key)!);

    // Update reference for next comparison
    previousDataRef.current = currentMap;

    console.log('📊 Content update analysis:', {
      total: data.length,
      new: newItems.length,
      updated: updatedItems.length,
      unchanged: unchangedItems.length,
      removed: removedItems.length
    });

    return { updatedItems, newItems, removedItems, unchangedItems };
  }, [data, keyField]);

  return {
    updatedItems,
    newItems,
    removedItems,
    unchangedItems,
    hasChanges: updatedItems.length > 0 || newItems.length > 0 || removedItems.length > 0
  };
};
