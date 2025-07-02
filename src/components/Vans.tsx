
import React, { Suspense, useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';
import { useVanMutations } from '@/hooks/useVansOptimized';

// Lazy load van-related components
const VansIndex = React.lazy(() => import('./vans/VansIndex'));
const VanDetail = React.lazy(() => import('./vans/VanDetail'));

const VanLoadingSkeleton = () => (
  <div className="h-screen flex flex-col overflow-hidden">
    <div className="flex-shrink-0 p-4 sm:p-6 border-b">
      <div className="flex justify-between items-center">
        <Skeleton className="h-8 w-48" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-10 w-10" />
          <Skeleton className="h-10 w-10" />
        </div>
      </div>
    </div>
    <div className="flex-shrink-0 p-4 sm:p-6 border-b">
      <Skeleton className="h-12 w-full" />
    </div>
    <div className="flex-1 overflow-y-auto p-4 sm:p-6">
      <div className="grid gap-6" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))' }}>
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-64 w-full" />
        ))}
      </div>
    </div>
  </div>
);

const Vans = () => {
  const { refreshVans } = useVanMutations();
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Refresh data when component mounts (user enters the page)
  useEffect(() => {
    refreshVans();
  }, [refreshVans]);

  const handleRefresh = async () => {
    if (isRefreshing) return;
    
    setIsRefreshing(true);
    
    try {
      await refreshVans();
    } finally {
      setTimeout(() => setIsRefreshing(false), 500);
    }
  };

  return (
    <div className="h-screen overflow-hidden">
      <Suspense fallback={<VanLoadingSkeleton />}>
        <Routes>
          <Route path="/" element={<VansIndex onRefresh={handleRefresh} isRefreshing={isRefreshing} />} />
          <Route path="/:vanId" element={<VanDetail />} />
        </Routes>
      </Suspense>
    </div>
  );
};

export default Vans;
