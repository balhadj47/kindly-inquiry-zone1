
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { EnhancedSkeleton } from '@/components/ui/enhanced-skeleton';

const EmployeesEnhancedSkeleton = () => {
  return (
    <div className="space-y-8">
      {/* Header with better spacing */}
      <div className="flex items-center justify-between mb-8">
        <div className="space-y-3">
          <EnhancedSkeleton className="h-10 w-80" variant="text" />
          <EnhancedSkeleton className="h-5 w-48" variant="text" size="sm" />
        </div>
        <div className="flex items-center gap-4">
          <EnhancedSkeleton className="h-11 w-32" variant="button" />
          <EnhancedSkeleton className="h-11 w-11" variant="button" />
        </div>
      </div>

      {/* Filters with enhanced spacing */}
      <Card className="shadow-sm border-border/20">
        <CardContent className="p-8">
          <div className="space-y-6">
            <EnhancedSkeleton className="h-6 w-24" variant="text" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-3">
                <EnhancedSkeleton className="h-4 w-20" variant="text" size="sm" />
                <EnhancedSkeleton className="h-11 w-full" variant="button" />
              </div>
              <div className="space-y-3">
                <EnhancedSkeleton className="h-4 w-16" variant="text" size="sm" />
                <EnhancedSkeleton className="h-11 w-full" variant="button" />
              </div>
              <div className="space-y-3">
                <EnhancedSkeleton className="h-4 w-24" variant="text" size="sm" />
                <EnhancedSkeleton className="h-11 w-full" variant="button" />
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <EnhancedSkeleton className="h-10 w-28" variant="button" />
              <EnhancedSkeleton className="h-10 w-20" variant="button" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Employee cards with enhanced spacing and visual hierarchy */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="shadow-sm border-border/20 hover:shadow-md transition-shadow duration-200">
            <CardHeader className="pb-4 space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <EnhancedSkeleton className="h-16 w-16" variant="avatar" />
                  <div className="space-y-3">
                    <EnhancedSkeleton className="h-6 w-32" variant="text" />
                    <EnhancedSkeleton className="h-4 w-24" variant="text" size="sm" />
                  </div>
                </div>
                <EnhancedSkeleton className="h-6 w-20" variant="button" />
              </div>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <EnhancedSkeleton className="h-3 w-16" variant="text" size="sm" />
                  <EnhancedSkeleton className="h-4 w-24" variant="text" size="sm" />
                </div>
                <div className="space-y-2">
                  <EnhancedSkeleton className="h-3 w-12" variant="text" size="sm" />
                  <EnhancedSkeleton className="h-4 w-20" variant="text" size="sm" />
                </div>
              </div>
              
              <div className="space-y-3">
                <EnhancedSkeleton className="h-3 w-20" variant="text" size="sm" />
                <EnhancedSkeleton className="h-4 w-full" variant="text" size="sm" />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-border/10">
                <EnhancedSkeleton className="h-9 w-20" variant="button" />
                <EnhancedSkeleton className="h-9 w-9" variant="button" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default EmployeesEnhancedSkeleton;
