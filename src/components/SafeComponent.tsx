
import React, { ReactNode } from 'react';

interface SafeComponentProps {
  children: ReactNode;
  fallback?: ReactNode;
  componentName?: string;
}

export const SafeComponent: React.FC<SafeComponentProps> = ({ 
  children, 
  fallback = null, 
  componentName = 'Component' 
}) => {
  try {
    return <>{children}</>;
  } catch (error) {
    console.error(`🔴 Error in ${componentName}:`, error);
    return <>{fallback}</>;
  }
};
