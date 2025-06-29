
import { User } from '@/types/rbac';
import { SystemGroup } from '@/types/systemGroups';

export class PermissionsBusinessLogic {
  static canUserPerformAction(
    user: User | null,
    action: string,
    roles: SystemGroup[]
  ): boolean {
    if (!user) return false;
    
    // Business rule: Admin users can perform all actions
    if (user.role_id === 1) return true;
    
    const userRole = roles.find(role => parseInt(role.id) === user.role_id);
    if (!userRole) return false;
    
    return userRole.permissions.includes(action);
  }

  static getUserPermissions(user: User | null, roles: SystemGroup[]): string[] {
    if (!user) return [];
    
    const userRole = roles.find(role => parseInt(role.id) === user.role_id);
    return userRole?.permissions || [];
  }

  static canAccessMissions(user: User | null, roles: SystemGroup[]): boolean {
    return this.canUserPerformAction(user, 'trips:read', roles);
  }

  static canCreateMissions(user: User | null, roles: SystemGroup[]): boolean {
    return this.canUserPerformAction(user, 'trips:create', roles);
  }

  static canEditMissions(user: User | null, roles: SystemGroup[]): boolean {
    return this.canUserPerformAction(user, 'trips:update', roles);
  }

  static canDeleteMissions(user: User | null, roles: SystemGroup[]): boolean {
    return this.canUserPerformAction(user, 'trips:delete', roles);
  }

  static canManageUsers(user: User | null, roles: SystemGroup[]): boolean {
    return this.canUserPerformAction(user, 'users:manage', roles);
  }

  static canManageVans(user: User | null, roles: SystemGroup[]): boolean {
    return this.canUserPerformAction(user, 'vans:manage', roles);
  }
}
