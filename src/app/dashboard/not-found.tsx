'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const Custom404: React.FC = () => {
  const router = useRouter();

  const handleGoHome = () => {
    router.push('/dashbaord'); // Redirect to the homepage
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-gray-700">
      <div className="text-center">
        <h1 className="text-6xl font-extrabold text-red-500">404</h1>
        <p className="text-xl mt-4">Oops! The page you're looking for doesn't exist.</p>
        <div className="mt-6 space-x-4">
          <button
            onClick={handleGoHome}
            className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-all duration-200"
          >
            Go to Home
          </button>
          <Link href="/" passHref>
            <button className="bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition-all duration-200">
              Back to Dashboard
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Custom404;
