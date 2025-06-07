
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import AppSidebar from '@/components/AppSidebar';
import TopBar from '@/components/TopBar';
import Dashboard from '@/components/Dashboard';
import Companies from '@/components/Companies';
import Vans from '@/components/Vans';
import Drivers from '@/components/Drivers';
import Users from '@/components/Users';
import TripLogger from '@/components/TripLogger';
import TripHistory from '@/components/TripHistory';

const Index = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <SidebarInset className="flex-1 flex flex-col">
          <TopBar />
          <main className="flex-1 overflow-auto">
            <div className="container mx-auto p-4 sm:p-6 lg:p-8">
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
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default Index;
