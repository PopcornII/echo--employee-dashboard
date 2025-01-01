// DocumentPage.tsx
'use client';

import React, { useEffect, useState } from 'react';
import DocumentUploadForm from '@/app/components/DocumentUploadForm';
import DocumentList from '@/app/components/DocumentList';
import { getToken, getProfile, isTokenExpired, clearAll } from '@/app/utils/storeToken';
import { useRouter } from 'next/navigation';

const DocumentPage: React.FC = () => {
  const [documents, setDocuments] = useState<any[]>([]); 
  const router = useRouter();
  const token = getToken();
  const profile = getProfile();
  const isExpired = isTokenExpired(token);
 
useEffect(() =>{
  
  if (!token || !profile || isExpired){
    clearAll();  // Clear all tokens and navigate to login page
    router.push('/auth/login');
    return;
  };


}, [router]);
  

  const handleDocumentUpload = (newDocument: any) => {
    setDocuments((prevDocuments) => [...prevDocuments, newDocument]);
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Document Upload Form */}
      <DocumentUploadForm token={token} onDocumentUpload={handleDocumentUpload} />

      {/* Document List with Pagination */}
      <DocumentList documents={documents} />
    </div>
  );
};

export default DocumentPage;
