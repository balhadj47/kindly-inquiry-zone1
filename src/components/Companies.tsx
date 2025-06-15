
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import CompaniesIndex from './companies/CompaniesIndex';
import CompanyDetail from './companies/CompanyDetail';
import BranchDetail from './companies/BranchDetail';

const Companies = () => {
  // Top-level manages which view is showing via routes.
  return (
    <Routes>
      <Route path="/" element={<CompaniesIndex />} />
      <Route path=":companyId" element={<CompanyDetail />} />
      <Route path="branch/:branchId" element={<BranchDetail />} />
    </Routes>
  );
};

export default Companies;
