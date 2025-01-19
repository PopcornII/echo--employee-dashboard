import React from 'react';
import Sidebar from './SideBarMenu';
import Header from './Header';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 flex flex-col">
        <Header />
        <div className="p-4 bg-gray-100 flex-1">{children}</div>
      </main>
    </div>
  );
};

export default Layout;
