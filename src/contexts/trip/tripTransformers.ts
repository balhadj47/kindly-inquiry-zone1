// Re-export from the standardized transformers
export { 
  transformDatabaseTrip, 
  transformDatabaseTrips 
} from '@/services/dataTransformers';

// Legacy compatibility - keeping existing exports
export { tripTransformer } from '@/services/dataTransformers';
