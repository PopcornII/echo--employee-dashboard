'use client';

import React, {useState, useEffect} from 'react';
import Link from 'next/link';
import { useLoginStore } from '../store/useAuthStore';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';


const Sidebar: React.FC = () => {
  const { permissions, user, logout } = useLoginStore();
  const pathname = usePathname();
  const router = useRouter();
  const [activeMenu, setActiveMenu] = useState<string>(pathname); // Default active menu based on initial path

  useEffect(() => {
    // Update active menu when the route changes
    setActiveMenu(pathname);
  }, [pathname]);

  // Default permissions to empty array if undefined or null
  const userPermissions = permissions || [];
  // Define the menu items with associated permissions
  const menuItems = [
    { name: 'Home', path: '/dashboard', permission: 'read' },
    { name: 'Dashoboard', path: '/dashboard/home', permission: 'update' },
    { name: 'Documents', path: '/dashboard/documents', permission: 'update' },
    { name: 'Config', path: '/dashboard/config', permission: 'update' },
    { name: 'Settings', path: '/dashboard/settings', permission: 'update' },
    { name: 'Profile', path: '/dashboard/profile', permission: 'update' },
  ];

  // Filter the menu items based on the user's permissions
  const accessibleMenuItems = menuItems.filter((item) =>
    userPermissions?.includes(item.permission) // Ensure the user has permission to see the menu item
  );

  const handleLogout = () => {
    logout(); // Clear the user data from the store
    router.push('/'); // Redirect to the login page
  };

  return (
    <div className="w-full h-screen bg-light-gray  text-gray-700 flex flex-col justify-between">
      <div>
        <div className="p-4 text-xl font-bold flex items-center gap-2">
          <span className="text-blue-500">📚</span> Welcome {user.name}
        </div>
        <nav>
          <ul>
            {accessibleMenuItems.length > 0 ? (
              accessibleMenuItems.map((item) => (
                <li key={item.name} 
                className={`px-4 py-2 hover:bg-gray-300 rounded transition-all duration-200 ${
                  activeMenu === item.path ? 'bg-blue-500' : ''
                }`} // Highlight active menu item
                >
                  <Link href={item.path} onClick={() => setActiveMenu(item.path)}>
                  {item.name}
                  </Link>
                </li>
              ))
            ) : (
              <li className="px-4 py-2">No accessible menu items</li>
            )}
          </ul>
        </nav>
      </div>
      <div className="mt-4 px-4 py-2">
        <button
          onClick={() => { handleLogout(); }}
          className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-all duration-200"
        >
          Logout
        </button>
      </div>
    </div>
    
  );
};

export default Sidebar;

