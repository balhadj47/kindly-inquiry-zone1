
import { useMemo } from 'react';
import { transformBatch } from '@/services/dataTransformers';

interface UseDataTransformationOptions {
  logErrors?: boolean;
  enableCache?: boolean;
}

export const useDataTransformation = <TInput, TOutput>(
  data: TInput[],
  transformer: (item: TInput) => TOutput | null,
  options: UseDataTransformationOptions = {}
) => {
  const { logErrors = true, enableCache = true } = options;

  return useMemo(() => {
    if (!data || !Array.isArray(data)) {
      console.warn('useDataTransformation: Invalid data provided');
      return [];
    }

    return transformBatch(data, transformer, { logErrors });
  }, enableCache ? [data, transformer, logErrors] : [data, transformer, logErrors, Math.random()]);
};

export const useTransformationStats = <TInput, TOutput>(
  originalData: TInput[],
  transformedData: TOutput[]
) => {
  return useMemo(() => ({
    originalCount: originalData?.length || 0,
    transformedCount: transformedData?.length || 0,
    successRate: originalData?.length > 0 
      ? Math.round((transformedData?.length / originalData.length) * 100) 
      : 100,
    hasErrors: (originalData?.length || 0) > (transformedData?.length || 0)
  }), [originalData, transformedData]);
};
