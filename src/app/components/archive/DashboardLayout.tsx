'use client';

// components/DashboardLayout.tsx
import React, { ReactNode, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getToken , getProfile} from '@/app/utils/storeToken';

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [activeMenu, setActiveMenu] = useState('Home');
  const router = useRouter();

  const menuItems = [
    { name: 'Home', route: '/dashboard/home' },
    { name: 'Documents', route: '/dashboard/documents' },
    { name: 'Settings', route: '/dashboard/settings' },
  ];

  const handleMenuClick = (menu: string, route: string) => {
    setActiveMenu(menu);
    router.push(route);
  };

  //Trigger navigation if fail token
  useEffect(()=> {
    const token = getToken();
    console.log(token);
    const profile = getProfile();
    console.log(profile);

    if (!token || !profile) {
      router.push('/auth/login');
    }
    
  }, [router]);

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white flex flex-col">
        <div className="py-4 px-6 font-bold text-lg">Dashboard</div>
        <nav className="flex-1 px-4">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li
                key={item.name}
                className={`p-2 rounded-md cursor-pointer ${
                  activeMenu === item.name
                    ? 'bg-gray-700'
                    : 'hover:bg-gray-700'
                }`}
                onClick={() => handleMenuClick(item.name, item.route)}
              >
                {item.name}
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Topbar */}
        <header className="bg-gray-100 py-4 px-6 shadow">
          <h1 className="text-lg font-semibold">{activeMenu}</h1>
        </header>

        {/* Content */}
        <main className="flex-1 p-6 bg-gray-50 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
