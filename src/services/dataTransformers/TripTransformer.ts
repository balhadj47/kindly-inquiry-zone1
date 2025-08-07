
import { BaseTransformer } from './types';
import { Trip } from '@/contexts/TripContext';
import { CompanyBranchSelection } from '@/types/company-selection';

export interface DatabaseTrip {
  id: any;
  van?: string;
  driver?: string;
  company?: string;
  branch?: string;
  created_at?: string;
  notes?: string;
  user_ids?: string[];
  user_roles?: any;
  start_km?: number;
  end_km?: number;
  status?: string;
  planned_start_date?: string;
  planned_end_date?: string;
  companies_data?: CompanyBranchSelection[];
}

export class TripTransformer extends BaseTransformer<DatabaseTrip, Trip> {
  transform(dbTrip: DatabaseTrip): Trip {
    if (!dbTrip) {
      throw new Error('Trip data is required');
    }

    const idValidation = this.validateRequired(dbTrip.id, 'Trip ID');
    if (!idValidation.isValid) {
      throw new Error(idValidation.errors?.[0] || 'Invalid trip ID');
    }

    console.log('🔄 TripTransformer: Raw DB data:', JSON.stringify(dbTrip, null, 2));

    return {
      id: parseInt(dbTrip.id.toString()),
      van: dbTrip.van || '',
      driver: dbTrip.driver || '',
      company: dbTrip.company || '',
      branch: dbTrip.branch || '',
      timestamp: dbTrip.created_at || new Date().toISOString(),
      notes: dbTrip.notes || '',
      userIds: dbTrip.user_ids || [],
      userRoles: dbTrip.user_roles || [],
      startKm: dbTrip.start_km || 0,
      endKm: dbTrip.end_km || null,
      status: dbTrip.status || 'active',
      startDate: dbTrip.planned_start_date ? new Date(dbTrip.planned_start_date) : undefined,
      endDate: dbTrip.planned_end_date ? new Date(dbTrip.planned_end_date) : undefined,
      // Add database field aliases for compatibility
      start_km: dbTrip.start_km || 0,
      end_km: dbTrip.end_km || null,
      created_at: dbTrip.created_at || new Date().toISOString(),
      // Add companies_data for multiple companies support
      companies_data: dbTrip.companies_data || [],
    };
  }

  // Legacy compatibility method
  transformDatabaseTrip = this.transform.bind(this);
  transformDatabaseTrips = this.transformArray.bind(this);
}

// Export singleton instance
export const tripTransformer = new TripTransformer();
