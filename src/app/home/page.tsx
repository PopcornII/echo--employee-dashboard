'use client';

import { useRouter } from 'next/navigation';
import { getProfile } from '@/app/utils/storeToken'; // Centralized API logic
import GridComponent from '@/app/components/GridComponent';

export default function HomePage() {
  const router = useRouter();
  const user = getProfile();

  // Redirect to login if no user is found
  if (!user) {
    router.push('/login');
    return null;
  }

  const handleLogout = () => {
    document.cookie = 'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;';
    localStorage.removeItem('user_profile');
    router.push('/login');
  };

  const gridData = [
    { id: 1, title: 'Document 1', description: 'Description of Document 1' },
    { id: 2, title: 'Document 2', description: 'Description of Document 2' },
    { id: 3, title: 'Document 3', description: 'Description of Document 3' },
    { id: 4, title: 'Document 4', description: 'Description of Document 4' },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-600 text-white p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Welcome To My Page</h1>
        <button

          className="bg-red-500 px-4 py-2 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </header>

      <main className="p-6">
        <h2 className="text-2xl font-bold mb-4">Your Documents</h2>
        <GridComponent data={gridData} />
      </main>
    </div>
  );
}
