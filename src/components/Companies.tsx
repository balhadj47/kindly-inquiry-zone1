
import React, { Suspense, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';
import { useCompanies } from '@/hooks/useCompanies';
import { useQueryClient } from '@tanstack/react-query';

// Lazy load company-related components
const CompaniesIndex = React.lazy(() => import('./companies/CompaniesIndex'));
const CompanyDetail = React.lazy(() => import('./companies/CompanyDetail'));
const BranchDetail = React.lazy(() => import('./companies/BranchDetail'));

const CompanyLoadingSkeleton = () => (
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

const Companies = () => {
  const { refetch: refetchCompanies } = useCompanies();
  const queryClient = useQueryClient();

  // Clear cache and refresh data when component mounts after RLS fix
  useEffect(() => {
    console.log('🏢 Companies component mounted after RLS fix, clearing cache and refreshing data');
    
    // Clear all company-related cached data
    queryClient.removeQueries({ queryKey: ['companies'] });
    
    // Force fresh fetch
    refetchCompanies?.();
  }, [refetchCompanies, queryClient]);

  return (
    <Suspense fallback={<CompanyLoadingSkeleton />}>
      <Routes>
        <Route path="/" element={<CompaniesIndex />} />
        <Route path=":companyId" element={<CompanyDetail />} />
        <Route path="branch/:branchId" element={<BranchDetail />} />
      </Routes>
    </Suspense>
  );
};

export default Companies;
