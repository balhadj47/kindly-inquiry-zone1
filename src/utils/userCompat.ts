
import { User } from '@/types/rbac';

// Add backward compatibility for role property
export const addRoleCompatibility = (user: User): User & { role: string } => {
  return {
    ...user,
    get role() {
      return user.systemGroup;
    }
  } as User & { role: string };
};

export const addRoleCompatibilityToUsers = (users: User[]): (User & { role: string })[] => {
  return users.map(addRoleCompatibility);
};
