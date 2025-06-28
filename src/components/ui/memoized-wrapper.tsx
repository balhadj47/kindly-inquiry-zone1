
import React, { memo } from 'react';

interface MemoizedWrapperProps {
  children: React.ReactNode;
  deps?: any[];
}

const MemoizedWrapper: React.FC<MemoizedWrapperProps> = memo(
  ({ children }) => {
    return <>{children}</>;
  },
  (prevProps, nextProps) => {
    // Custom comparison for better memoization
    if (prevProps.deps && nextProps.deps) {
      return prevProps.deps.every((dep, index) => 
        Object.is(dep, nextProps.deps![index])
      );
    }
    return JSON.stringify(prevProps) === JSON.stringify(nextProps);
  }
);

MemoizedWrapper.displayName = 'MemoizedWrapper';

export default MemoizedWrapper;
