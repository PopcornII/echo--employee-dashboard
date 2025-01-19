

import React, { useState, lazy, Suspense, useRef } from 'react';
import Comments from './Comments';
import Spinner from './Spinner'; 
import { FaTimes } from 'react-icons/fa';
import { useLoginStore } from '../store/useAuthStore';
import Reactions from './Reactions';
import { formatDate }  from './FormatDate'


const DocumentDetailModal = lazy(() => import('./DocumentDetailModal'));

interface Document {
  id: number;
  title: string;
  description: string;
  img_url: string | null;
  file_url: string;
  created_at: string | 'N/A';
}

interface DocumentCardProps {
  document: Document;
  userId: number; 
}


const DocumentCard: React.FC<DocumentCardProps> = ({ document, userId }) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [showPdfPreview, setShowPdfPreview] = useState(false);
  const commentInputRef = useRef<HTMLInputElement | null>(null);

  const { permissions } = useLoginStore();

  const defaultImage = '/document.png';

  const handleModalOpen = () => setShowModal(true);
  const handleModalClose = () => setShowModal(false);

  const toggleComments = () => {
    setShowComments((prev) => !prev);
    if (!showComments) {
      setTimeout(() => commentInputRef.current?.focus(), 100);
    }
  };

  
  const togglePdfPreview = () => setShowPdfPreview((prev) => !prev);

  return (
    <div className="p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
      <h3
        className="text-lg font-semibold mb-2 cursor-pointer hover:underline"
        onClick={handleModalOpen}
        tabIndex={0}
        aria-label={`View details for ${document?.title}`}
        role="button"
      >
        {document?.title}
      </h3>
      <p className="text-sm text-gray-600 mb-4">
        {document?.description || 'No description available.'}
      </p>
      {document?.created_at && (
        <p className="text-sm text-gray-500 mb-4">
          Uploaded on: {new Date(document?.created_at).toLocaleDateString()}
        </p>
      )}
      <div className="relative w-full h-40 mb-4">
        {imageLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <Spinner />
          </div>
        )}
        <img
          src={!imageError && document.img_url ? document.img_url : defaultImage}
          alt={document?.title || 'Document'}
          className={`w-full h-40 object-cover rounded-lg cursor-pointer ${imageLoading ? 'opacity-0' : 'opacity-100'} transition-opacity`}
          onLoad={() => setImageLoading(false)}
          onError={() => setImageError(true)}
          onClick={handleModalOpen}
        />
      </div>

        { permissions?.includes('update') && (
          <div className="flex items-center space-x-2 mt-4 justify-between">
            {permissions?.includes('update') && document?.file_url && (
          <a
            href={document?.file_url}
            download
            className="text-blue-500 hover:underline flex items-center space-x-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-5">
              <path fillRule="evenodd" d="M5.478 5.559A1.5 1.5 0 0 1 6.912 4.5H9A.75.75 0 0 0 9 3H6.912a3 3 0 0 0-2.868 2.118l-2.411 7.838a3 3 0 0 0-.133.882V18a3 3 0 0 0 3 3h15a3 3 0 0 0 3-3v-4.162c0-.299-.045-.596-.133-.882l-2.412-7.838A3 3 0 0 0 17.088 3H15a.75.75 0 0 0 0 1.5h2.088a1.5 1.5 0 0 1 1.434 1.059l2.213 7.191H17.89a3 3 0 0 0-2.684 1.658l-.256.513a1.5 1.5 0 0 1-1.342.829h-3.218a1.5 1.5 0 0 1-1.342-.83l-.256-.512a3 3 0 0 0-2.684-1.658H3.265l2.213-7.191Z" clipRule="evenodd" />
              <path fillRule="evenodd" d="M12 2.25a.75.75 0 0 1 .75.75v6.44l1.72-1.72a.75.75 0 1 1 1.06 1.06l-3 3a.75.75 0 0 1-1.06 0l-3-3a.75.75 0 0 1 1.06-1.06l1.72 1.72V3a.75.75 0 0 1 .75-.75Z" clipRule="evenodd" />
            </svg>

          </a>
        )}
          
        <button
          className="text-gray-500 hover:underline"
          onClick={togglePdfPreview}
        >
          {showPdfPreview ?
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-5">
              <path d="M3.53 2.47a.75.75 0 0 0-1.06 1.06l18 18a.75.75 0 1 0 1.06-1.06l-18-18ZM22.676 12.553a11.249 11.249 0 0 1-2.631 4.31l-3.099-3.099a5.25 5.25 0 0 0-6.71-6.71L7.759 4.577a11.217 11.217 0 0 1 4.242-.827c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113Z" />
              <path d="M15.75 12c0 .18-.013.357-.037.53l-4.244-4.243A3.75 3.75 0 0 1 15.75 12ZM12.53 15.713l-4.243-4.244a3.75 3.75 0 0 0 4.244 4.243Z" />
              <path d="M6.75 12c0-.619.107-1.213.304-1.764l-3.1-3.1a11.25 11.25 0 0 0-2.63 4.31c-.12.362-.12.752 0 1.114 1.489 4.467 5.704 7.69 10.675 7.69 1.5 0 2.933-.294 4.242-.827l-2.477-2.477A5.25 5.25 0 0 1 6.75 12Z" />
            </svg>
          : 
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-5">
              <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
              <path fillRule="evenodd" d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 0 1 0-1.113ZM17.25 12a5.25 5.25 0 1 1-10.5 0 5.25 5.25 0 0 1 10.5 0Z" clipRule="evenodd" />
            </svg>
          }
        </button>

        {permissions.includes('update') && showPdfPreview && (
          <div className="fixed inset-0 bg-black bg-opacity-55 z-50 flex items-center justify-center">
            <button
              className="absolute top-4 right-4 text-white text-2xl"
              onClick={togglePdfPreview}
            >
              <FaTimes />
            </button>
            <iframe
              src={document.file_url}
              className="w-full h-full "
              style={{ border: 'none' }}
              title="PDF Preview"
            
            />
          </div>
        )}
      </div>
        
      )}

      {permissions?.includes('update') && (
        <div className="relative py-4 cursor-pointer text-gray-600 hover:text-gray-800">
          <Reactions
            documentId={document?.id}
            userId={userId}  
          />
        </div>
          
        )}


      {permissions?.includes('create') && permissions?.includes('update') && (
        <div
          className="flex items-center mt-4 cursor-pointer text-gray-600 hover:text-gray-800"
          onClick={toggleComments}
        >
          <span>{showComments ? 
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-5">
            <path d="M19.5 22.5a3 3 0 0 0 3-3v-8.174l-6.879 4.022 3.485 1.876a.75.75 0 1 1-.712 1.321l-5.683-3.06a1.5 1.5 0 0 0-1.422 0l-5.683 3.06a.75.75 0 0 1-.712-1.32l3.485-1.877L1.5 11.326V19.5a3 3 0 0 0 3 3h15Z" />
            <path d="M1.5 9.589v-.745a3 3 0 0 1 1.578-2.642l7.5-4.038a3 3 0 0 1 2.844 0l7.5 4.038A3 3 0 0 1 22.5 8.844v.745l-8.426 4.926-.652-.351a3 3 0 0 0-2.844 0l-.652.351L1.5 9.589Z" />
          </svg>  
        : 
            <div className='flex felx-row'>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-5">
              <path d="M1.5 8.67v8.58a3 3 0 0 0 3 3h15a3 3 0 0 0 3-3V8.67l-8.928 5.493a3 3 0 0 1-3.144 0L1.5 8.67Z" />
              <path d="M22.5 6.908V6.75a3 3 0 0 0-3-3h-15a3 3 0 0 0-3 3v.158l9.714 5.978a1.5 1.5 0 0 0 1.572 0L22.5 6.908Z" />
            </svg>
            <p className='ml-2 font-bold'>Comments</p>
            </div>
          
      
          }
          </span>
        </div>
      )}

        {permissions?.includes('update') && showComments && (
            <Comments
              documentId={document?.id}
              userId={userId}
            />
          
        )}



      {permissions?.includes('update') && showModal && (
        <Suspense fallback={<Spinner />}>
          <DocumentDetailModal
            document={document}
            userId={userId}
            onClose={handleModalClose}
          />
        </Suspense>
      )}


    </div>
  );
};

export default DocumentCard;
