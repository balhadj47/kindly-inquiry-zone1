
// Main exports for user hooks
export { useUsers } from './useUsersQuery';
export { useUsersByRoleId } from './useUsersByRole';
export { useUser } from './useSingleUser';
export { useUserMutations } from './useUserMutations';
export type { User, UsersQueryResult } from './types';

// Re-export for backward compatibility
export {
  useUsers as useUsersOptimized,
  useUsersByRoleId as useUsersByRoleIdOptimized,
  useUser as useUserOptimized,
  useUserMutations as useUserMutationsOptimized,
} from './index';
