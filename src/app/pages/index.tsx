'use client';


import RegisterModal from '../register/page';

export default async function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-blue-600 mb-4">Welcome to the Registration Page</h1>
        <RegisterModal />
      </div>
    </div>
  );
}



