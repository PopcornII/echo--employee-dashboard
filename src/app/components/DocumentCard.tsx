import React, { useState, lazy, Suspense, useEffect, useRef } from 'react';
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
  const [selectedReaction, setSelectedReaction] = useState<string | null>(null);
  const [hoveredEmoji, setHoveredEmoji] = useState<string | null>(null);
  const [reactionCounts, setReactionCounts] = useState<Record<string, number>>({}); // Track reaction counts per emoji
  const [userReactionCount, setUserReactionCount] = useState<number>(0); // Track total reactions by user for the document
  const [showPdfPreview, setShowPdfPreview] = useState(false); // PDF preview toggle
  const commentInputRef = useRef<HTMLInputElement | null>(null);

  const { permissions, user } = useLoginStore();

  const defaultImage = '/document.png'; // Path to your default placeholder image

  useEffect(() => {
    const fetchReactions = async () => {
      try {
        const response = await fetch(`/api/reactions/id?id=${document.id}&userId=${userId}`);
        const data = await response.json();

        if (data.userReaction) {
          setSelectedReaction(data.userReaction.emoji);
        }

        // Count total reactions per emoji
        const counts: Record<string, number> = {};
        let userReactionCount = 0;

        data.reactionCounts.forEach((reaction: { emoji: string; count: number }) => {
          counts[reaction.emoji] = reaction.count;
          if (reaction.emoji === selectedReaction) {
            userReactionCount = reaction.count;
          }
        });
        setReactionCounts(counts);
        setUserReactionCount(userReactionCount);
      } catch (error) {
        console.error('Error fetching reactions:', error);
      }
    };

    fetchReactions();
  }, [document.id, userId, selectedReaction]);

  const handleModalOpen = () => setShowModal(true);
  const handleModalClose = () => setShowModal(false);

  const toggleComments = () => {
    setShowComments((prev) => !prev);
    if (!showComments) {
      setTimeout(() => commentInputRef.current?.focus(), 100);
    }
  };

  const handleReactionChange = async (emoji: string) => {
    if (emoji === selectedReaction) return;

    try {
      await fetch(`/api/reactions/id?id=${document.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ documentId: document.id, userId: user.id, emoji }),
      });

      setSelectedReaction(emoji);

      // Update reaction count for the new emoji
      setReactionCounts((prev) => ({
        ...prev,
        [emoji]: (prev[emoji] || 0) + 1,
      }));

      // Update user-specific reaction count
      setUserReactionCount((prev) => (prev === 0 ? 1 : prev));
    } catch (error) {
      console.error('Error updating reaction:', error);
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
          className={`w-full h-40 object-cover rounded-lg cursor-pointer ${imageLoading ? 'opacity-0' : 'opacity-100'} transition-opacity`}
          onLoad={() => setImageLoading(false)}
          onError={() => setImageError(true)}
          onClick={handleModalOpen}
        />
      </div>

      {permissions?.includes('update') && document?.file_url && (
        <a
          href={document?.file_url}
          download
          className="text-blue-500 hover:underline flex items-center space-x-2"
        >
          <IoCloudDownload className="text-2xl" />
          <span>Download</span>
        </a>
      )}

      <div className="flex items-center space-x-2 mt-4">
        <button
          className="text-blue-500 hover:underline"
          onClick={togglePdfPreview}
        >
          {showPdfPreview ? 'Close PDF' : 'View PDF'}
        </button>
        <span className="text-gray-600">Likes: {userReactionCount}</span>
      </div>

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
            className="w-full h-full"
            style={{ border: 'none' }}
            title="PDF Preview"
          />
        </div>
      )}

      {permissions?.includes('create') && permissions?.includes('update') && (
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
                  {emoji} <span>{reactionCounts[emoji] || 0}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {permissions?.includes('create') && permissions?.includes('update') && (
        <div
          className="flex items-center mt-4 cursor-pointer text-gray-600 hover:text-gray-800"
          onClick={toggleComments}
        >
          {showComments ? <FaTimes className="mr-2" /> : <FaComment className="mr-2" />}
          <span>{showComments ? 'Hide Comments' : 'Show Comments'}</span>
        </div>
      )}

      {permissions?.includes('update') && showComments && (
        <div className="mt-4">
          <CommentsAndReactions
            documentId={document?.id}
            userId={userId}
          />
        </div>
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
