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
  const user = useLoginStore((state) => state.user);  
  const router = useRouter();

  useEffect(() => {
    initializeSession();
    // Wait for authentication state to be updated
    const checkAuthStatus = setInterval(() => {
      if (isAuthenticated !== null) {
        setLoading(false);
        if (!isAuthenticated) {
          router.replace('/'); 
        }
        clearInterval(checkAuthStatus);
      }
    }, 100); 


    return () => clearInterval(checkAuthStatus); // Cleanup interval
  }, [initializeSession, isAuthenticated, router]);

  if (loading) {
    return (
      <button type="button" className="bg-indigo-500 ..." disabled>
        <svg className="animate-spin h-5 w-5 mr-3 ..." viewBox="0 0 24 24"/>
        Processing...
      </button>
    ); 
  }

  return <>{isAuthenticated ? children : null}</>; 
};

export default ProtectedRoute;
