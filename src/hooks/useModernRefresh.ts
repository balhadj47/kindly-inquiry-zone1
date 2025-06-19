import { useCallback, useState, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';

interface RefreshOptions {
  showToast?: boolean;
  onStart?: () => void;
  onComplete?: () => void;
}

export const useModernRefresh = <T extends { id: string; updated_at?: string }>() => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [refreshProgress, setRefreshProgress] = useState(0);
  const lastRefreshRef = useRef<number>(0);
  const { toast } = useToast();

  const smartUpdate = useCallback((
    currentData: T[],
    newData: T[],
    updateCallback: (data: T[]) => void
  ) => {
    console.log('🔄 Smart update: Analyzing changes...');
    
    const currentMap = new Map(currentData.map(item => [item.id, item]));
    const newMap = new Map(newData.map(item => [item.id, item]));
    
    let updatedItems = 0;
    let newItems = 0;
    let unchangedItems = 0;

    // Build the updated array preserving unchanged references
    const updatedData = newData.map(newItem => {
      const currentItem = currentMap.get(newItem.id);
      
      if (!currentItem) {
        newItems++;
        return newItem; // Completely new item
      }
      
      // Check if item has actually changed
      const hasChanges = JSON.stringify(currentItem) !== JSON.stringify(newItem);
      
      if (hasChanges) {
        updatedItems++;
        return newItem; // Updated item
      }
      
      unchangedItems++;
      return currentItem; // Preserve exact same reference for unchanged items
    });

    console.log(`✅ Smart update completed:`, {
      total: updatedData.length,
      updated: updatedItems,
      new: newItems,
      unchanged: unchangedItems
    });

    // Only update if there are actual changes
    if (updatedItems > 0 || newItems > 0) {
      updateCallback(updatedData);
      return { hasChanges: true, updatedItems, newItems };
    }
    
    return { hasChanges: false, updatedItems: 0, newItems: 0 };
  }, []);

  const modernRefresh = useCallback(async (
    currentData: T[],
    fetchFunction: () => Promise<T[]>,
    updateCallback: (data: T[]) => void,
    options: RefreshOptions = {}
  ) => {
    const { showToast = true, onStart, onComplete } = options;
    
    // Prevent multiple simultaneous refreshes
    const now = Date.now();
    if (isRefreshing || (now - lastRefreshRef.current) < 1000) {
      console.log('🚫 Refresh throttled');
      return;
    }

    try {
      setIsRefreshing(true);
      setRefreshProgress(0);
      lastRefreshRef.current = now;
      onStart?.();

      console.log('🚀 Modern refresh started...');
      
      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setRefreshProgress(prev => Math.min(prev + 20, 80));
      }, 100);

      const freshData = await fetchFunction();
      
      clearInterval(progressInterval);
      setRefreshProgress(90);

      const result = smartUpdate(currentData, freshData, updateCallback);
      
      setRefreshProgress(100);
      
      if (showToast) {
        if (result.hasChanges) {
          toast({
            title: '✅ Données actualisées',
            description: `${result.updatedItems + result.newItems} éléments mis à jour`,
            duration: 2000,
          });
        } else {
          toast({
            title: '📊 Données à jour',
            description: 'Aucune modification détectée',
            duration: 1500,
          });
        }
      }

      console.log('🎯 Modern refresh completed successfully');
      
    } catch (error) {
      console.error('❌ Modern refresh failed:', error);
      
      if (showToast) {
        toast({
          title: 'Erreur de rafraîchissement',
          description: 'Impossible de récupérer les données',
          variant: 'destructive',
        });
      }
    } finally {
      // Smooth transition out
      setTimeout(() => {
        setIsRefreshing(false);
        setRefreshProgress(0);
        onComplete?.();
      }, 200);
    }
  }, [isRefreshing, smartUpdate, toast]);

  return {
    modernRefresh,
    isRefreshing,
    refreshProgress,
  };
};
