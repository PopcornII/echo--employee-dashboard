'use client'

import './styles/global.css';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

// export const metadata = {
//   title: 'Document Management System',
//   description: 'Manage documents, upload, and comment.',
// };

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<{ name: string } | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      fetch('/api/auth/user', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error('Invalid token');
          }
        })
        .then((data) => {
          if (data.user) {
            setUser(data.user);
          }
        })
        .catch(() => {
          localStorage.removeItem('auth_token');
        });
    }
  }, []);

  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-800">
        <header className="bg-white shadow p-4 flex justify-between items-center">
        <div className="text-xl font-bold">LOGO</div>
        <nav className="space-x-4">
          <a href="#" className="text-gray-700 hover:text-black">Home</a>
          <a href="#" className="text-gray-700 hover:text-black">Community</a>
          <a href="#" className="text-gray-700 hover:text-black">Contact</a>
          <button className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded">Dashboard</button>
        </nav>
      </header>
      <main className="container mx-auto py-8">{children}</main>
      <footer className="bg-white py-8">
          <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">
            <div>
              <div className="text-lg font-bold mb-2">LOGO</div>
              <ul className="space-y-2">
              <li>Hello</li>
                
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-2">Explore</h4>
              <ul className="space-y-2">
              <li>Hello</li>
              
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-2">Resources</h4>
              <ul className="space-y-2">
                <li>Hello</li>
                
              </ul>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
};

export default RootLayout;
