
'use client';

import { useEffect, useState } from 'react';
import './styles/global.css';

const Home = () => {
  const [user, setUser] = useState<{ username: string } | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token) {
      fetch('/api/validate-token', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.user) {
            setUser(data.user);
          }
        })
        .catch(() => {
          localStorage.removeItem('token');
        });
    }
  }, []);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-blue-600 mb-4">Welcome to the Home Screen</h1>
        {user ? (
          <p className="text-center text-lg">Welcome, <strong>{user.username}</strong>! You are logged in.</p>
        ) : (
          <p className="text-center text-lg">You are a guest. Please log in to access additional features.</p>
        )}
      </div>
    </div>
  );
};

export default Home;
