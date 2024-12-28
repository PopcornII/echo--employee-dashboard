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
        <header className="bg-blue-600 text-white p-4 shadow-md">
          <div className="container mx-auto flex justify-between items-center">
            <h1 className="text-2xl font-semibold">Document Management System</h1>
            {user && (
              <button
                className="px-4 py-2 bg-blue-700 rounded hover:bg-blue-800"
                onClick={() => router.push('/dashboard')}
              >
                Dashboard
              </button>
            )}
          </div>
        </header>
        <main className="container mx-auto py-8">{children}</main>
        <footer className="bg-gray-800 text-white text-center py-4">
          <p>&copy; {new Date().getFullYear()} Document Management System. All rights reserved.</p>
        </footer>
      </body>
    </html>
  );
};

export default RootLayout;
