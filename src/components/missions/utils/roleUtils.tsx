
import React from 'react';
import { Crown, Car, Shield, UserCheck } from 'lucide-react';

export const getRoleIcon = (roleName: string) => {
  const roleStr = roleName.toLowerCase();
  if (roleStr.includes('chef') || roleStr.includes('leader')) {
    return <Crown className="h-4 w-4 text-yellow-600" />;
  }
  if (roleStr.includes('chauffeur') || roleStr.includes('driver')) {
    return <Car className="h-4 w-4 text-blue-600" />;
  }
  if (roleStr.includes('aps') || roleStr.includes('security')) {
    return <Shield className="h-4 w-4 text-green-600" />;
  }
  if (roleStr.includes('armé') || roleStr.includes('armed')) {
    return <Shield className="h-4 w-4 text-red-600" />;
  }
  return <UserCheck className="h-4 w-4 text-gray-600" />;
};
