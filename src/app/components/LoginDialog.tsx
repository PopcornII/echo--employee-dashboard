'use client';

import React, { useState } from 'react';
import { useLoginStore } from '@/app/store/useAuthStore';
import { useRouter } from 'next/navigation';
import { message } from 'antd';




const LoginDialog: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { setUser, setToken } = useLoginStore();
  const router = useRouter();
  const [messageApi, contextHolder] = message.useMessage();
    const successMessage = (message: string) => {
      messageApi.open({
        type: 'success',
        content: message,
      });
    };
  
  
    const errorMessage = (error: string) => {
      messageApi.open({
        type: 'error',
        content: error,
      });
    };


  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setError(''); // Clear previous error
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const errorMessage =
          response.status === 401
            ? 'Invalid username or password.'
            : 'An unexpected error occurred. Please try again.';
        throw new Error(errorMessage);
      }

      const { user, auth_token } = await response.json();
      // Set user and token in global state (also handles cookies)
      setUser(user);
      setToken(auth_token);
      setUsername('');
      setPassword('');
      successMessage('Successfully logged in!');
      router.replace('/dashboard');
      
      
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
      errorMessage(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGuestLogin = async () => {
    setIsLoading(true);
    const response = await fetch('/api/auth/guest', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: "guest@gmail.com", password: "123456" }),
    });
    if (!response.ok) {
      const errorMessage =
        response.status === 401
         ? 'Invalid guest credentials.'
          : 'An unexpected error occurred. Please try again.';
      throw new Error(errorMessage);


    }
    const { user, auth_token } = await response.json();
    setUser(user);
    setToken(auth_token);
    successMessage('Welcome as Guest!');

    router.replace('/dashboard');
  };
  return (
    <>
    {contextHolder}
     <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white shadow-indigo-50/40 p-4 rounded-lg shadow-2xl min-w-sm max-w-md w-full text-center">
        <h2 className="text-3xl font-bold mb-4 text-gray-600">Login</h2>
        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="border p-2 w-full mb-4 rounded-lg"
            required
            disabled={isLoading}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border p-2 w-full mb-4 rounded-lg"
            required
            disabled={isLoading}
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <div className="flex justify-center space-x-16 my-4">
            <button
              type="button"
              className="bg-green text-white py-3 px-12 rounded-lg"
              onClick={handleGuestLogin}
              disabled={isLoading} // Disable while loading
            >
              Guest!
            </button>
            <button
              type="submit"
              className="bg-navyblue text-white py-3 px-12 rounded-lg bg-opacity-80"
              disabled={isLoading} // Disable while loading
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </button>
          </div>
        </form>
      </div>
    </div>
    </>
    
  );
};

export default LoginDialog;
