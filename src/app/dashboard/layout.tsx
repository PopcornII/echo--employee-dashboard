'use client';

import React from 'react';
import Sidebar from '@/app/components/SideBarMenu';
import Header from '@/app/components/Header';
import ProtectedRoute from '../components/ProtectedRoute';

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {

    return (

      <ProtectedRoute> {/* Wrap the content with ProtectedRoute */}
      <div className="flex h-screen">
        {/* Static Sidebar */}
        <aside className="sm:w-24 md:w-48 lg:64 bg-white border-r border-gray-200 h-full fixed">
          <Sidebar />
        </aside>
  
        {/* Main Content Area */}
        <div className="sm:w-24 lg:ml-48 flex-1 flex flex-col">
          {/* Static Header */}
          <header className="h-14 bg-white border-b sticky top-0 border-gray-200 z-10 flex items-center w-full">
            <Header />
          </header>
          {/* Scrollable Content */}
          <main className="mt-2 h-full overflow-y-auto bg-gray-100">
            {children}
          </main>
        </div>
      </div>
    </ProtectedRoute>
    );


};

export default DashboardLayout;
