import React, { useState } from 'react';
import { useRouter } from 'next/router';

const EntryScreen: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        alert('Invalid credentials');
        return;
      }

      const data = await response.json();
      document.cookie = `auth_token=${data.token}; path=/; expires=${new Date(
        Date.now() + 3600 * 1000
      ).toUTCString()}`;

      alert('Login successful');
      router.push('/home');
    } catch (error) {
      console.error('Login failed:', error);
      alert('Error during login');
    }
  };

  const handleGuestLogin = () => {
    document.cookie = `auth_token=guest; path=/;`;
    router.push('/home');
  };

  return (
    <div className="relative min-h-screen bg-gray-100">
      {/* Top-right login button */}
      <button
        onClick={() => router.push('/')}
        className="absolute top-4 right-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
      >
        Login
      </button>

      {/* Main content */}
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-3xl font-bold mb-8">Welcome</h1>
        <form
          onSubmit={handleLogin}
          className="flex flex-col w-full max-w-sm p-6 bg-white rounded-lg shadow-md"
        >
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="p-3 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="p-3 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <button
            type="submit"
            className="p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Login
          </button>
        </form>
        <button
          onClick={handleGuestLogin}
          className="mt-4 p-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
        >
          Login as Guest
        </button>
      </div>
    </div>
  );
};

export default EntryScreen;
