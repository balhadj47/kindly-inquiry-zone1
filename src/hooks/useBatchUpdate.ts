
import { useCallback, useRef } from 'react';

interface BatchUpdateOptions {
  batchSize?: number;
  delay?: number;
}

export const useBatchUpdate = <T>(
  updateFunction: (items: T[]) => Promise<void>,
  options: BatchUpdateOptions = {}
) => {
  const { batchSize = 10, delay = 100 } = options;
  const queueRef = useRef<T[]>([]);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const processingRef = useRef(false);

  const processBatch = useCallback(async () => {
    if (processingRef.current || queueRef.current.length === 0) {
      return;
    }

    processingRef.current = true;
    const itemsToProcess = queueRef.current.splice(0, batchSize);
    
    try {
      await updateFunction(itemsToProcess);
    } catch (error) {
      console.error('Batch update failed:', error);
      // Re-add failed items to front of queue
      queueRef.current.unshift(...itemsToProcess);
    } finally {
      processingRef.current = false;
      
      // Process remaining items if any
      if (queueRef.current.length > 0) {
        timeoutRef.current = setTimeout(processBatch, delay);
      }
    }
  }, [updateFunction, batchSize, delay]);

  const addToBatch = useCallback((item: T) => {
    queueRef.current.push(item);
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(processBatch, delay);
  }, [processBatch, delay]);

  const addMultipleToBatch = useCallback((items: T[]) => {
    queueRef.current.push(...items);
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(processBatch, delay);
  }, [processBatch, delay]);

  const flush = useCallback(async () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    await processBatch();
  }, [processBatch]);

  const clear = useCallback(() => {
    queueRef.current = [];
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  return {
    addToBatch,
    addMultipleToBatch,
    flush,
    clear,
    queueSize: queueRef.current.length,
    isProcessing: processingRef.current
  };
};
