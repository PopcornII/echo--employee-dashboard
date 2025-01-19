import React from 'react';
import Comments from './Comments';
import Reactions from './Reactions';
import { formatDate } from './FormatDate';


interface Document {
  id: number;
  title: string;
  description: string;
  img_url: string | null;
  file_url: string;
  created_at: string | 'null';
}

interface DocumentDetailModalProps {
  document: Document;
  userId: number;
  onClose: () => void;
}

const DocumentDetailModal: React.FC<DocumentDetailModalProps> = ({
  document,
  userId,
  onClose,
}) => {
  const defaultImage = '/document.png';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-xl h-4/5 overflow-y-auto">
        <button
          className="relative sticky top-0 right-4 text-gray-900 hover:text-gray-700"
          onClick={onClose}
        >
          ✖
        </button>
        <h2 className="text-xl font-bold mb-4">{document.title}</h2>
        <p className="text-sm text-gray-600 mb-4">
          {document.description || 'No description available.'}
        </p>
        {document.created_at && (
          <p className="text-xs text-gray-500 mb-4">
            Public On: {formatDate(document.created_at)}
          </p>
        )}
        <img
          src={document.img_url || defaultImage}
          alt={document.title || 'Document'}
          className="w-full h-64 object-cover rounded-lg mb-4"
        />
        {document.file_url && (
          <a
            href={document.file_url}
            download
            className="text-blue-500 hover:underline"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 3.75H6.912a2.25 2.25 0 0 0-2.15 1.588L2.35 13.177a2.25 2.25 0 0 0-.1.661V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18v-4.162c0-.224-.034-.447-.1-.661L19.24 5.338a2.25 2.25 0 0 0-2.15-1.588H15M2.25 13.5h3.86a2.25 2.25 0 0 1 2.012 1.244l.256.512a2.25 2.25 0 0 0 2.013 1.244h3.218a2.25 2.25 0 0 0 2.013-1.244l.256-.512a2.25 2.25 0 0 1 2.013-1.244h3.859M12 3v8.25m0 0-3-3m3 3 3-3" />
            </svg>

          </a>
        )}
        <div className='relative mb-6 top-1'> 
          <Reactions documentId={document.id} userId={userId} />

        </div>
        
        {/* Comments and Reactions */}
        <Comments documentId={document.id} userId={userId} />
      </div>
    </div>
  );
};

export default DocumentDetailModal;
