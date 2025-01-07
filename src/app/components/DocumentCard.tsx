import React, { useState, lazy, Suspense, useRef } from 'react';
import CommentsAndReactions from './CommentsAndReactions';
import Spinner from './Spinner'; // Placeholder spinner component
import { FaComment, FaTimes, FaRegSmile } from 'react-icons/fa';
import { IoCloudDownload } from "react-icons/io5";
import { useLoginStore } from '../store/useAuthStore';

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
  userId: number; // Pass the logged-in user's ID
}

const EMOJIS = ['👍', '❤️', '😂', '😮', '😢', '😡']; // Sample reaction emojis

const DocumentCard: React.FC<DocumentCardProps> = ({ document, userId }) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [selectedReaction, setSelectedReaction] = useState<string | null>(null); // User's reaction
  const [hoveredEmoji, setHoveredEmoji] = useState<string | null>(null);
  const commentInputRef = useRef<HTMLInputElement | null>(null);

  const { permissions, user } = useLoginStore();

  const defaultImage = '/document.png'; // Path to your default placeholder image

  const handleModalOpen = () => setShowModal(true);
  const handleModalClose = () => setShowModal(false);

  const toggleComments = () => {
    setShowComments((prev) => !prev);
    if (!showComments) {
      // Delay focus to ensure the input is rendered
      setTimeout(() => commentInputRef.current?.focus(), 100);
    }
  };

  const handleReactionChange = async (emoji: string) => {
    if (emoji === selectedReaction) return; // No need to update if it's the same reaction

    try {
      await fetch(`/api/reactions/id?id=${document.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ documentId: document.id, userId, emoji }),
      });

      setSelectedReaction(emoji);
    } catch (error) {
      console.error('Error updating reaction:', error);
    }
  };

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
        <p className="text-xs text-gray-500 mb-4">
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
          className={`w-full h-40 object-cover rounded-lg cursor-pointer ${
            imageLoading ? 'opacity-0' : 'opacity-100'
          } transition-opacity`}
          onLoad={() => setImageLoading(false)}
          onError={() => setImageError(true)}
          onClick={handleModalOpen}
        />
      </div>
      {document?.file_url && (
        <a
          href={document?.file_url}
          download
          className="text-blue-500 hover:underline"
        >
         <IoCloudDownload className="text-2xl" />
        </a>
      )}

      {/* Reaction Section */}
      <div className="relative flex items-center mt-4">
        <button
          className="flex items-center space-x-2 text-gray-600 hover:text-blue-500"
          onClick={() => setHoveredEmoji((prev) => (prev ? null : 'hover'))}
        >
          {selectedReaction ? (
            <span>{selectedReaction}</span>
          ) : (
            <FaRegSmile className="text-lg" />
          )}
          <span className="text-sm">React</span>
        </button>


        {hoveredEmoji && (
          <div className="absolute top-0 left-0 mt-8 flex space-x-2 bg-white shadow-lg p-2 rounded-lg z-10">
            {EMOJIS.map((emoji) => (
              <button
                key={emoji}
                className="text-xl hover:scale-110 transform transition-transform"
                onClick={() => handleReactionChange(emoji)}
              >
                {emoji}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Toggle Comments Icon */}
      <div
        className="flex items-center mt-4 cursor-pointer text-gray-600 hover:text-gray-800"
        onClick={toggleComments}
      >
        {showComments ? <FaTimes className="mr-2" /> : <FaComment className="mr-2" />}
        <span>{showComments ? 'Hide Comments' : 'Show Comments'}</span>
      </div>

      {/* Comments and Reactions */}
      {showComments && (
        <div className="mt-4">
          <CommentsAndReactions
            documentId={document?.id}
            userId={userId}
            // commentInputRef={commentInputRef}
          />
        </div>
      )}

      {/* Document Detail Modal */}
      {showModal && (
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
