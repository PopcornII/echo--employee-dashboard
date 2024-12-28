'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { getUserProfile, uploadDocument, fetchUserDocuments } from '@/lib/apiAxios'; // Centralized API logic

export default function Dashboard() {
  const router = useRouter();
  const user = getUserProfile();

  const [documents, setDocuments] = useState([]);
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Redirect to login if no user is found
  if (!user) {
    router.push('/login');
    return null;
  }

  // Fetch user-created documents
  React.useEffect(() => {
    async function fetchData() {
      const docs = await fetchUserDocuments(user.id);
      setDocuments(docs);
    }
    fetchData();
  }, [user.id]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    setFile(selectedFile || null);
  };

  const handleUpload = async () => {
    if (!file) {
      alert('Please select a file to upload.');
      return;
    }

    setIsUploading(true);
    try {
      const response = await uploadDocument(file, user.id);
      if (response.success) {
        alert('Document uploaded successfully!');
        setDocuments((prev) => [...prev, response.document]);
      } else {
        alert('Document upload failed: ' + response.message);
      }
    } catch (error) {
      console.error('Error uploading document:', error);
      alert('An error occurred while uploading the document.');
    } finally {
      setIsUploading(false);
      setFile(null);
    }
  };

  const handleLogout = () => {
    document.cookie = 'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;';
    localStorage.removeItem('user_profile');
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-600 text-white p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Dashboard - {user.name}</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 px-4 py-2 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </header>

      <main className="p-6">
        <h2 className="text-2xl font-bold mb-4">Upload Document</h2>
        <div className="bg-white p-4 rounded shadow-md mb-6">
          <input
            type="file"
            onChange={handleFileChange}
            className="mb-4 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:bg-blue-600 file:text-white hover:file:bg-blue-700"
          />
          <button
            onClick={handleUpload}
            disabled={isUploading}
            className={`px-4 py-2 rounded text-white ${
              isUploading ? 'bg-gray-500 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600'
            }`}
          >
            {isUploading ? 'Uploading...' : 'Upload Document'}
          </button>
        </div>

        <h2 className="text-2xl font-bold mb-4">Your Documents</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {documents.map((doc: any) => (
            <div
              key={doc.id}
              className="bg-white p-4 rounded shadow-md hover:shadow-lg transition-shadow"
            >
              <h3 className="text-lg font-bold">{doc.name}</h3>
              <p className="text-gray-600">{doc.description}</p>
              <a
                href={doc.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline mt-2 inline-block"
              >
                Download
              </a>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
