
import React from 'react';
import { FixedSizeList as List } from 'react-window';

interface VirtualizedListProps {
  height: number;
  itemCount: number;
  itemSize: number;
  itemData?: any;
  children: React.ComponentType<any>;
  className?: string;
}

const VirtualizedList: React.FC<VirtualizedListProps> = ({
  height,
  itemCount,
  itemSize,
  itemData,
  children,
  className = "",
}) => {
  return (
    <div className={className}>
      <List
        height={height}
        itemCount={itemCount}
        itemSize={itemSize}
        itemData={itemData}
      >
        {children}
      </List>
    </div>
  );
};

export default VirtualizedList;
