'use client';

import React, { useState, useEffect } from 'react';
import DocumentTable from '@/app/components/TableDocument';
import { useLoginStore } from '@/app/store/useAuthStore';
import DocumentPostForm from '@/app/components/PostFormModal';
import DocumentEditForm from '@/app/components/DocumentEditForm';
import { Modal, message } from 'antd';
import ConfirmDeleteDialog from '@/app/components/DeleteConfirmModal';

interface DocumentData {
  id: number;
  title: string;
  description: string;
  img_url: string | null;
  file_url: string;
  created_at: string | 'N/A';
}

const TablePage = () => {
  const { token } = useLoginStore();
  const [documents, setDocuments] = useState<DocumentData[]>([]);
  const [selectedDocument, setSelectedDocument] = useState<DocumentData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);


  //console.log('Selected Document:', selectedDocument);

  const [messageApi, contextHolder] = message.useMessage();

  const success = (messageBody: string) => {
    messageApi.open({
      type: 'success',
      content: messageBody,
    });
  };

  const error = (messageBody: string) => {
    messageApi.open({
      type: 'error',
      content: messageBody,
    });
  };

  // Fetch documents from API
  const fetchDocuments = async () => {
    try {
      const response = await fetch('/api/documents/get-all');
      if (!response.ok) throw new Error('Failed to fetch documents');
      const { data } = await response.json();
      setDocuments(data);
    } catch (err) {
      console.error('Error fetching documents:', err);
      error('Failed to fetch documents. Please try again.');
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const toggleModal = () => setIsModalOpen(!isModalOpen);
  const toggleEditModal = () => setIsEditModalOpen(!isEditModalOpen);
  const toggleDeleteModal = () => setIsDeleteModalOpen(!isDeleteModalOpen);

  const handleDocumentUpload = () => {
    fetchDocuments(); // Refetch documents to ensure consistency
  };

  const handleEdit = (id: number) => {
    const documentToEdit = documents.find((doc) => doc.id === id);
    setSelectedDocument(documentToEdit || null);
    setIsEditModalOpen(true);
  };

  const handleDelete = () => {
    setIsDeleteModalOpen(true);
  };

  return (
    <div className="fixed flex flex-col p-6 bg-gray-50 min-h-screen sm:w-1/2 lg:w-full">
      <h2 className="text-2xl font-semibold mb-6">Document Management</h2>
      <div className='ml-6 min-h-screen sm:w-1/2 lg:w-5/6'>

      {contextHolder}
      <DocumentTable
        documents={documents}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onCreate={toggleModal}
      />

      {/* Post Document Modal */}
      {isModalOpen && (
        <Modal
          open={isModalOpen}
          onCancel={toggleModal}
          footer={null}
          title= {null}
          >
           
          <DocumentPostForm
            token={token}
            onDocumentUpload={handleDocumentUpload}
            onSuccess={() => {
              toggleModal();
              success('Document uploaded successfully.');
            }}
            onClose={toggleModal}
          />

        </Modal>   
        
      )}

      {/* Edit Document Modal */}
      {isEditModalOpen && selectedDocument && (
        <Modal
          open={isEditModalOpen}
          onCancel={toggleEditModal}
          footer={null}
          title= {null}
        >
          <DocumentEditForm
            documentId={selectedDocument?.id || 0}
            onDocumentUpload={handleDocumentUpload}
            selectedDocument={selectedDocument} 
            onClose={toggleEditModal}
            onSuccess={() => {
              toggleEditModal();
              success('Document updated successfully.');
              fetchDocuments();
            }}
            
          />
        </Modal>
      )}
      
      {/* Delete Document Modal */}
      {isDeleteModalOpen && selectedDocument && (
        <ConfirmDeleteDialog
          title="Are you sure you want to delete this document?"
          open={isDeleteModalOpen}
          onCancel={toggleDeleteModal}
          onOk={ async () => {
            try {
              const response = await fetch(`api/documents/id?id=${selectedDocument?.id}`, {
                method: 'DELETE',
    
              });
              if (response.ok) {
                success('Document deleted successfully.');
                setDocuments((prev) => prev.filter((doc) => doc.id !== selectedDocument?.id));
                toggleDeleteModal();
    
              } else {
                throw new Error('Failed to delete document');
              }
            } catch (err) {
              console.error('Error deleting document:', err);
              error('Failed to delete document. Please try again.');
            }
          }
        }
         
        />
      )}
      </div>
    </div>
  );
};

export default TablePage;
