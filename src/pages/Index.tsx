
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from '@/components/Sidebar';
import Dashboard from '@/components/Dashboard';
import Companies from '@/components/Companies';
import Vans from '@/components/Vans';
import Drivers from '@/components/Drivers';
import Users from '@/components/Users';
import TripLogger from '@/components/TripLogger';
import TripHistory from '@/components/TripHistory';

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <main className="pt-16">
        <div className="p-3 sm:p-4 md:p-6">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/companies" element={<Companies />} />
            <Route path="/vans" element={<Vans />} />
            <Route path="/drivers" element={<Drivers />} />
            <Route path="/users" element={<Users />} />
            <Route path="/trip-logger" element={<TripLogger />} />
            <Route path="/trip-history" element={<TripHistory />} />
          </Routes>
        </div>
      </main>
    </div>
  );
};

export default Index;
