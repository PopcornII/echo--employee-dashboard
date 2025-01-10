'use client'

import React, { useState} from 'react';
import { useLoginStore } from '../store/useAuthStore';
import DocumentPostForm from './PostFormModal';



const Header: React.FC = () => {
  const { user, permissions, token } = useLoginStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = () => setIsModalOpen(!isModalOpen);
   // Handle success after document upload
   const handleSuccess = () => {
    alert('Document uploaded successfully!');
    setIsModalOpen(false);  // Close the modal after success
  };

  // Handle document upload to update the document list
  const handleDocumentUpload = (newDoc: any) => {
    
    
    
    console.log('New Document uploaded:', newDoc);
  };


  return (
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
                token={token}  // Pass the token to the modal
                onDocumentUpload={handleDocumentUpload}  // Callback to handle document upload
                onClose={toggleModal}  // Callback to close the modal
                onSuccess={handleSuccess}  // Callback to handle success
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
          {user?.role === 1 && (
            <span className="text-bold text-green px-2 py-1 rounded text-sm ml-2">
              System Admin
            </span>
          )}
           {user?.role === 2 && (
            <span className="text-bold text-green px-2 py-1 rounded text-sm ml-2">
              Admin
            </span>
          )}
           {user?.role === 3 && (
            <span className="text-bold text-green px-2 py-1 rounded text-sm ml-2">
              Lecture
            </span>
          )}
           {user?.role === 4 && (
            <span className="text-bold text-green px-2 py-1 rounded text-sm ml-2">
              Student
            </span>
          )}
           {user?.role === 5 && (
            <span className="text-bold text-green px-2 py-1 rounded text-sm ml-2">
              Guest
            </span>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
