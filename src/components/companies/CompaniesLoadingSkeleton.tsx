
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const CompaniesLoadingSkeleton = () => {
  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header skeleton */}
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-10 w-full sm:w-40" />
      </div>

      {/* Search skeleton */}
      <Card>
        <CardContent className="p-4 sm:pt-6">
          <div className="relative">
            <Skeleton className="h-10 w-full" />
          </div>
        </CardContent>
      </Card>

      {/* Grid skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start space-x-2 min-w-0 flex-1">
                  <Skeleton className="h-5 w-5 flex-shrink-0 mt-0.5" />
                  <Skeleton className="h-6 w-32" />
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <Skeleton className="h-8 w-16" />
                  <Skeleton className="h-8 w-8" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Skeleton className="h-4 w-24 mb-2" />
                <div className="flex flex-wrap gap-1">
                  <Skeleton className="h-5 w-16" />
                  <Skeleton className="h-5 w-20" />
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center pt-2 border-t border-gray-100 gap-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-3 w-24" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CompaniesLoadingSkeleton;
