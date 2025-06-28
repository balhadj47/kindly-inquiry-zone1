
import React, { useMemo, useCallback } from 'react';
import { FixedSizeList as List } from 'react-window';

interface OptimizedVirtualListProps<T> {
  items: T[];
  height: number;
  itemHeight: number;
  renderItem: (item: T, index: number) => React.ReactNode;
  className?: string;
  overscan?: number;
}

const OptimizedVirtualList = <T,>({
  items,
  height,
  itemHeight,
  renderItem,
  className = "",
  overscan = 5
}: OptimizedVirtualListProps<T>) => {
  
  const itemData = useMemo(() => ({
    items,
    renderItem
  }), [items, renderItem]);

  const Row = useCallback(({ index, style, data }: any) => {
    const item = data.items[index];
    return (
      <div style={style} key={index}>
        {data.renderItem(item, index)}
      </div>
    );
  }, []);

  if (items.length === 0) {
    return (
      <div className={`flex items-center justify-center h-32 ${className}`}>
        <p className="text-gray-500">No items to display</p>
      </div>
    );
  }

  return (
    <div className={className}>
      <List
        height={height}
        width="100%"
        itemCount={items.length}
        itemSize={itemHeight}
        itemData={itemData}
        overscanCount={overscan}
      >
        {Row}
      </List>
    </div>
  );
};

export default OptimizedVirtualList;
