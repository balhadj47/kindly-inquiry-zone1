
import React from 'react';
import { User } from '@/types/rbac';
import { userTransformer, transformBatch } from '@/services/dataTransformers';

// Enhanced user data transformer with comprehensive error handling
export const transformOptimizedUser = userTransformer.safeTransformUser.bind(userTransformer);

export const useProcessedEmployees = (rawEmployees: any): User[] => {
  return React.useMemo(() => {
    try {
      console.log('👥 Employees: Processing raw employees data:', {
        rawEmployeesType: typeof rawEmployees,
        isArray: Array.isArray(rawEmployees),
        length: Array.isArray(rawEmployees) ? rawEmployees.length : 'N/A',
        sample: Array.isArray(rawEmployees) ? rawEmployees[0] : rawEmployees
      });

      if (!rawEmployees) {
        console.warn('⚠️ Employees: Raw employees data is null/undefined');
        return [];
      }

      if (!Array.isArray(rawEmployees)) {
        console.warn('⚠️ Employees: Raw employees data is not an array:', typeof rawEmployees, rawEmployees);
        return [];
      }

      // Use the standardized batch transformation
      const processed = transformBatch(
        rawEmployees,
        (user) => transformOptimizedUser(user),
        { logErrors: true }
      );

      console.log('✅ Employees: Successfully processed employees:', {
        originalCount: rawEmployees.length,
        processedCount: processed.length,
        filtered: processed.length !== rawEmployees.length
      });

      return processed;
    } catch (error) {
      console.error('❌ Employees: Critical error processing employees data:', error);
      return [];
    }
  }, [rawEmployees]);
};
