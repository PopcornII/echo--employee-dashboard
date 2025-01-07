'use client';

import { useLoginStore } from '../store/useAuthStore'; // Adjust to your Zustand store path
import Sidebar from '@/app/components/SideBarMenu'; // Ensure this path is correct
import Header from '@/app/components/Header';

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useLoginStore(); // Use Zustand store to get auth status

  // If not authenticated, show shimmer effect while loading
  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-full h-full bg-gray-200 animate-pulse">
          <div className="space-y-4 px-4 py-6">
            {/* Shimmer for Sidebar */}
            <div className="h-64 bg-gray-300 rounded-md animate-shimmer"></div>
            {/* Shimmer for Content */}
            <div className="h-16 bg-gray-300 rounded-md animate-shimmer"></div>
            {/* Shimmer for Header */}
            <div className="h-16 bg-gray-300 rounded-md animate-shimmer"></div>
            {/* Shimmer for Body */}
            <div className="h-64 bg-gray-300 rounded-md animate-shimmer"></div>
          </div>
        </div>
      </div>
    );
  }else{
    return (
      <div className="flex h-screen">
        {/* Static Sidebar */}
        <aside className="w-64 bg-white border-r border-gray-200 h-full fixed">
          <Sidebar />
        </aside>
  
        {/* Main Content Area */}
        <div className="ml-64 flex-1 flex flex-col ">
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
    );

  }

};

export default DashboardLayout;
