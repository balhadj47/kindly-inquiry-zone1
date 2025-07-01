
import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';

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
  console.log('🏢 Companies component mounted');

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
