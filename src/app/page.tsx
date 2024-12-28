'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const Home = () => {
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
  }, [router]);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
        <h1 className="text-3xl font-bold text-center text-blue-600 mb-4">
          {user ? 'Dashboard' : 'Welcome'}
        </h1>
        {user ? (
          <div className="text-center">
            <p className="text-lg">Hello, <strong>{user.name}</strong>!</p>
            <p>You are logged in. Access your documents and more from the dashboard.</p>
            <button
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              onClick={() => router.push('/dashboard')}
            >
              Go to Dashboard
            </button>
          </div>
        ) : (
          <div className="text-center">
            <p className="text-lg">You are currently a guest. Please log in to access additional features.</p>
            <button
              className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              onClick={() => router.push('/home')} // Assume you handle routing as a guest
            >
              Login as Guest
            </button>
      
            <button
              className="mt-6 px-8 py-2 bg-blue-600 text-white rounded hover:bg-green-700"
              onClick={() => router.push('/components/upload')} // Assume you handle routing as a guest
            >
              Upload
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
