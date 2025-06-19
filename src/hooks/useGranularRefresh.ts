
import { useCallback, useState } from 'react';

export const useGranularRefresh = <T extends { id: string }>() => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const updateGranular = useCallback((
    currentItems: T[],
    newItems: T[],
    setItems: React.Dispatch<React.SetStateAction<T[]>>
  ) => {
    console.log('🔄 Granular refresh: Analyzing changes...');
    
    let changeCount = 0;
    const currentMap = new Map(currentItems.map(item => [item.id, item]));
    const newMap = new Map(newItems.map(item => [item.id, item]));
    
    // Update items in place using functional update
    setItems(prevItems => {
      return prevItems.map(currentItem => {
        const newItem = newMap.get(currentItem.id);
        
        if (!newItem) {
          // Item was deleted - mark for removal
          return null;
        }
        
        // Deep compare to detect actual changes
        const hasRealChanges = JSON.stringify(currentItem) !== JSON.stringify(newItem);
        
        if (hasRealChanges) {
          console.log(`✏️ Item ${currentItem.id} updated`);
          changeCount++;
          return { ...newItem }; // Return new object only if changed
        }
        
        // Return exact same reference for unchanged items
        return currentItem;
      })
      .filter(Boolean) // Remove deleted items
      .concat(
        // Add completely new items
        newItems.filter(item => !currentMap.has(item.id))
      ) as T[];
    });
    
    console.log(`✅ Granular refresh completed: ${changeCount} items updated`);
    return changeCount;
  }, []);

  const refreshGranular = useCallback(async (
    currentItems: T[],
    fetchFn: () => Promise<T[]>,
    setItems: React.Dispatch<React.SetStateAction<T[]>>
  ) => {
    if (isRefreshing) return;
    
    try {
      setIsRefreshing(true);
      console.log('🚀 Starting granular refresh...');
      
      const freshData = await fetchFn();
      const changeCount = updateGranular(currentItems, freshData, setItems);
      
      console.log(`🎯 Granular refresh: ${changeCount} changes applied`);
      
    } catch (error) {
      console.error('❌ Granular refresh failed:', error);
    } finally {
      // Small delay to show refresh state
      setTimeout(() => setIsRefreshing(false), 200);
    }
  }, [isRefreshing, updateGranular]);

  return { refreshGranular, isRefreshing };
};
