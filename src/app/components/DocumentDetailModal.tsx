import React from 'react';
import CommentsAndReactions from './CommentsAndReactions';

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
  const defaultImage = '/document.png'; // Default placeholder image

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-3xl h-3/4 overflow-y-auto">
        <button
          className="flex top-4 right-4 text-gray-900 hover:text-gray-700"
          onClick={onClose}
        >
          ✖
        </button>
        <h2 className="text-2xl font-bold mb-4">{document.title}</h2>
        <p className="text-sm text-gray-600 mb-4">
          {document.description || 'No description available.'}
        </p>
        {document.created_at && (
          <p className="text-xs text-gray-500 mb-4">
            Uploaded on: {new Date(document.created_at).toLocaleDateString()}
          </p>
        )}
        <img
          src={document.img_url || defaultImage}
          alt={document.title || 'Document'}
          className="w-full h-60 object-cover rounded-lg mb-4"
        />
        {document.file_url && (
          <a
            href={document.file_url}
            download
            className="text-blue-500 hover:underline"
          >
            Download File
          </a>
        )}

        {/* Comments and Reactions */}
        <CommentsAndReactions documentId={document.id} userId={userId} />
      </div>
    </div>
  );
};

export default DocumentDetailModal;
