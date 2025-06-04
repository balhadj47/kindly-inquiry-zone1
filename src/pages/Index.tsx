
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from '@/components/Sidebar';
import Dashboard from '@/components/Dashboard';
import Companies from '@/components/Companies';
import Vans from '@/components/Vans';
import TripLogger from '@/components/TripLogger';
import TripHistory from '@/components/TripHistory';

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      <main className="flex-1 ml-0 md:ml-64 transition-all duration-300">
        <div className="p-4 md:p-6">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/companies" element={<Companies />} />
            <Route path="/vans" element={<Vans />} />
            <Route path="/trip-logger" element={<TripLogger />} />
            <Route path="/trip-history" element={<TripHistory />} />
          </Routes>
        </div>
      </main>
    </div>
  );
};

export default Index;
