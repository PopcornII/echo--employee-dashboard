'use client';

import { useState, useEffect } from 'react';
import DocumentGrid from '@/app/components/DocumentGrid';
import SearchBar from '@/app/components/SearchBar';
import { useLoginStore } from '@/app/store/useAuthStore';

interface Document {
  id: number;
  title: string;
  description: string;
  img_url: string | null;
  file_url: string;
  created_at: string | null;
}

export default function DashboardPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const { token, permissions , user} = useLoginStore();

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const response = await fetch('/api/documents/get-all', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch documents');
        }

        const { data } = await response.json();
        setDocuments(data);
      } catch (err) {
        setError('Failed to load documents. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, [token]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const filteredDocuments = documents.filter((doc) =>
    doc.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const hasAccess = permissions?.includes('read');

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <SearchBar onSearch={handleSearch} />

      {error && <div className="text-red-500">{error}</div>}
      {loading && <div>Loading documents...</div>}
      {!hasAccess && !loading && !error && (
        <div className="text-red-500">You do not have permission to view the documents.</div>
      )}
      {!loading && !error && hasAccess && filteredDocuments.length === 0 && (
        <div>No documents found.</div>
      )}
      {!loading && !error && hasAccess && (
        <DocumentGrid documents={filteredDocuments} userId={user?.id}/>
      )}
    </div>
  );
}
