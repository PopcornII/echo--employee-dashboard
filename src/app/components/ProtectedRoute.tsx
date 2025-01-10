'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLoginStore } from '@/app/store/useAuthStore';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const [loading, setLoading] = useState(true); // Loading state
  const isAuthenticated = useLoginStore((state) => state.isAuthenticated);
  const initializeSession = useLoginStore((state) => state.initializeSession);
  const router = useRouter();

  useEffect(() => {
    initializeSession(); // Ensure session is restored

    // Wait for authentication state to be updated
    const checkAuthStatus = setInterval(() => {
      if (isAuthenticated !== null) {
        setLoading(false);
        if (!isAuthenticated) {
          router.replace('/'); // Redirect to login if not authenticated
        }
        clearInterval(checkAuthStatus); // Stop checking once auth state is set
      }
    }, 100); // Check every 100ms (you can adjust this interval)

    return () => clearInterval(checkAuthStatus); // Cleanup interval
  }, [initializeSession, isAuthenticated, router]);

  if (loading) {
    return <div>Loading...</div>; // Optionally show a loading spinner or message while checking auth state
  }

  return <>{isAuthenticated ? children : null}</>; // Render content if authenticated
};

export default ProtectedRoute;
