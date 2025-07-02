
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export const VanCardSkeleton = () => (
  <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4 animate-pulse">
    <div className="flex items-start justify-between">
      <div className="space-y-2">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-4 w-24" />
      </div>
      <Skeleton className="h-6 w-16 rounded-full" />
    </div>
    
    <div className="grid grid-cols-2 gap-3">
      <div className="space-y-1">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-4 w-20" />
      </div>
      <div className="space-y-1">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-4 w-24" />
      </div>
    </div>
    
    <div className="flex gap-2 pt-2">
      <Skeleton className="h-8 flex-1" />
      <Skeleton className="h-8 flex-1" />
    </div>
  </div>
);

export const VansLoadingSkeleton = () => (
  <div className="h-screen flex flex-col overflow-hidden">
    <div className="flex-shrink-0 p-6 border-b bg-white">
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-5 w-32" />
        </div>
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-10" />
          <Skeleton className="h-10 w-40" />
        </div>
      </div>
    </div>
    
    <div className="flex-shrink-0 p-6 border-b bg-white">
      <div className="space-y-4">
        <Skeleton className="h-11 w-full" />
        <div className="flex gap-3">
          <Skeleton className="h-9 w-40" />
          <Skeleton className="h-9 w-48" />
          <Skeleton className="h-9 w-10" />
        </div>
      </div>
    </div>
    
    <div className="flex-1 overflow-y-auto p-6">
      <div className="grid gap-6" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))' }}>
        {Array.from({ length: 6 }).map((_, i) => (
          <VanCardSkeleton key={i} />
        ))}
      </div>
    </div>
  </div>
);
