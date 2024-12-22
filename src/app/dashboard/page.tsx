'use client'; 

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const Dashboard = () => {
  const [user, setUser] = useState<{ username: string } | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    } else {
      fetch('/api/validate-token', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.user) {
            setUser(data.user);
          } else {
            router.push('/login');
          }
        })
        .catch(() => {
          router.push('/login');
        });
    }
  }, [router]);

  if (!user) return <p>Loading...</p>;

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-blue-600 mb-4">Dashboard</h1>
        <p className="text-lg text-center">Hello, <strong>{user.username}</strong>!</p>
      </div>
    </div>
  );
};

export default Dashboard;
