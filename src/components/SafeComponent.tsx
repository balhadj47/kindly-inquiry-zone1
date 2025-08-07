
import React, { ReactNode } from 'react';

interface SafeComponentProps {
  children: ReactNode;
  fallback?: ReactNode;
  componentName?: string;
}

const SafeComponent: React.FC<SafeComponentProps> = ({ 
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

export { SafeComponent };
export default SafeComponent;
