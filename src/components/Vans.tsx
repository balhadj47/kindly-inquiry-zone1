
import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';

// Lazy load van-related components
const VansIndex = React.lazy(() => import('./vans/VansIndex'));
const VanDetail = React.lazy(() => import('./vans/VanDetail'));

const VanLoadingSkeleton = () => (
  <div className="space-y-6">
    <div className="flex justify-between items-center">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-10 w-32" />
    </div>
    <Skeleton className="h-12 w-full" />
    <div className="grid gap-6" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))' }}>
      {Array.from({ length: 6 }).map((_, i) => (
        <Skeleton key={i} className="h-64 w-full" />
      ))}
    </div>
  </div>
);

const Vans = () => {
  return (
    <Suspense fallback={<VanLoadingSkeleton />}>
      <Routes>
        <Route path="/" element={<VansIndex />} />
        <Route path=":vanId" element={<VanDetail />} />
      </Routes>
    </Suspense>
  );
};

export default Vans;
