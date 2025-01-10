'use client';

import React, {useState , useEffect} from 'react';
import Sidebar from '@/app/components/SideBarMenu'; // Ensure this path is correct
import Header from '@/app/components/Header';
import ProtectedRoute from '../components/ProtectedRoute'; // Assuming ProtectedRoute component exists


const DashboardLayout = ({ children }: { children: React.ReactNode }) => {

    return (

      <ProtectedRoute> {/* Wrap the content with ProtectedRoute */}
      <div className="flex h-screen">
        {/* Static Sidebar */}
        <aside className="w-64 bg-white border-r border-gray-200 h-full fixed">
          <Sidebar />
        </aside>
  
        {/* Main Content Area */}
        <div className="ml-64 flex-1 flex flex-col">
          {/* Static Header */}
          <header className="h-16 bg-white border-b fixed border-gray-200 z-10 flex items-center w-5/6">
            <Header />
          </header>
  
          {/* Scrollable Content */}
          <main className="mt-16 h-full overflow-y-auto bg-gray-100 p-4">
            {children}
          </main>
        </div>
      </div>
    </ProtectedRoute>

    )


};

export default DashboardLayout;
