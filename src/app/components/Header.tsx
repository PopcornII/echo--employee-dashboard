'use client'

import React, { useState, useEffect} from 'react';
import { useLoginStore } from '../store/useAuthStore';
import DocumentPostForm from './PostFormModal';
import { message } from 'antd';



const Header: React.FC = () => {
  const { user, permissions, token } = useLoginStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [documents, setDocuments] = useState<any[]>([]);
  const [messageApi, contextHolder] = message.useMessage();
  
  const successMessage = () => {
    messageApi.open({
      type: 'success',
      content: 'Success Uploaded Document',
    });
  };

  const errorMessage = (error: string) => {
    messageApi.open({
      type: 'error',
      content: error,
    });
  };

const fetchDocuments = async () => {
    try {
      const response = await fetch('/api/documents/get-all');
      const data = await response.json();
      setDocuments(data);

    } catch (error) {
      errorMessage('Failed to fetch documents');
    }
  };


  useEffect(() => {
    fetchDocuments();
    messageApi.destroy();
  }, []); 

  const toggleModal = () => setIsModalOpen(!isModalOpen);

   
   const handleSuccess = () => {
    setIsModalOpen(false);
    successMessage();
  };

  // Handle document upload to update the document list
  const handleDocumentUpload = (newDoc: any) => {
    setDocuments((prevDocuments) => [newDoc, ...prevDocuments]);  // Prepend the new document
  };

  return (
    <>
    {contextHolder}
    <header className="flex justify-end items-center p-4 bg-white shadow-md w-full z-10">
      {permissions.includes('create') && (
        <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 mr-4 rounded-lg "
        onClick={toggleModal}>
          New Post
        </button>
      )}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 w-full">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            {token && (
              <DocumentPostForm
                token={token}  
                onDocumentUpload={handleDocumentUpload} 
                onClose={toggleModal} 
                onSuccess={handleSuccess}
              />
            )}
          </div>
        </div>
      )}

      <div className="flex items-center gap-4">
        <button className="relative">
          🔔
          <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-4 h-4 text-xs flex items-center justify-center">
            3
          </span>
        </button>
        <div className="flex items-center gap-2">
          <img
            src="https://via.placeholder.com/32"
            alt="Profile"
            className="w-8 h-8 rounded-full"
          />
          
          <span>{user?.name}</span>
          {user?.role && (
          <span className="text-bold text-green px-2 py-1 rounded text-sm ml-2">
            {user.role === 1 && 'System Admin'}
            {user.role === 2 && 'Admin'}
            {user.role === 3 && 'Lecture'}
            {user.role === 4 && 'Student'}
            {user.role === 5 && ''}
          </span>
        )}
        </div>
      </div>
    </header>
    </>
    
  );
};

export default Header;
