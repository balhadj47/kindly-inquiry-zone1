
// Export all transformers
export { BaseTransformer } from './types';
export type { DataTransformer, ValidationResult, TransformationResult } from './types';

export { TripTransformer, tripTransformer } from './TripTransformer';
export { UserTransformer, userTransformer } from './UserTransformer';

// Convenience re-exports for common transformations
export const transformDatabaseTrip = tripTransformer.transform.bind(tripTransformer);
export const transformDatabaseTrips = tripTransformer.transformArray.bind(tripTransformer);
export const transformDatabaseUser = userTransformer.transform.bind(userTransformer);
export const transformDatabaseUsers = userTransformer.transformArray.bind(userTransformer);
export const transformOptimizedUser = userTransformer.safeTransformUser.bind(userTransformer);

// Batch transformation utilities
export const transformBatch = <TInput, TOutput>(
  data: TInput[],
  transformer: (item: TInput) => TOutput | null,
  options: { logErrors?: boolean } = {}
): TOutput[] => {
  const results: TOutput[] = [];
  const errors: Array<{ item: TInput; error: any }> = [];

  data.forEach((item, index) => {
    try {
      const result = transformer(item);
      if (result !== null) {
        results.push(result);
      }
    } catch (error) {
      errors.push({ item, error });
      if (options.logErrors) {
        console.error(`Batch transformation error at index ${index}:`, error, item);
      }
    }
  });

  if (errors.length > 0 && options.logErrors) {
    console.warn(`Batch transformation completed with ${errors.length} errors out of ${data.length} items`);
  }

  return results;
};
