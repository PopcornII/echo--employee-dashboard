import React, { useState, useEffect, useRef } from "react";
import { EMOJIS } from "../constants/emojis";
import Spinner from "./Spinner";

interface Comment {
  id: number;
  user_name: string;
  content: string;
  created_at: Date;
}

interface Reaction {
  emoji: string;
  count: number;
  userId?: number;
}

interface CommentsAndReactionsProps {
  documentId: number;
  userId: number;
  
}

const CommentsAndReactions: React.FC<CommentsAndReactionsProps> = ({
  documentId,
  userId,
}) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [reactions, setReactions] = useState<Record<string, number>>({});
  const [userReaction, setUserReaction] = useState<string | null>(null); // Track user's reaction
  const [loading, setLoading] = useState(false);
  const [commentsLoading, setCommentsLoading] = useState(true);
  const [showReactionsPanel, setShowReactionsPanel] = useState(false); // Show emoji picker
  const [hoveredEmoji, setHoveredEmoji] = useState<string | null>(null);

  const reactionPanelRef = useRef<HTMLDivElement | null>(null);

  // Fetch reactions and comments
  useEffect(() => {
    const fetchReactionsAndComments = async () => {
      try {
        const [reactionRes, commentRes] = await Promise.all([
          fetch(`/api/reactions/id?id=${documentId}&userId=${userId}`, { method: 'GET' }),
          fetch(`/api/comments/id?id=${documentId}`,{ method: 'GET' })
        ]);
        const { userReaction, reactionCounts } = await reactionRes.json();
        const commentsData: Comment[] = await commentRes.json();

        console.log("Reactions Data:", { userReaction, reactionCounts });
        console.log("Comments Data:", commentsData); // Debugging log

        const reactionMap: Record<string, number> = {};
      reactionCounts.forEach(({ emoji, count }: { emoji: string; count: number }) => {
        reactionMap[emoji] = count;
      });
        setReactions(reactionMap);

        // Process user reaction
        const userEmoji = userReaction[0]?.emoji || null;
        setUserReaction(userEmoji);

        // Handle Comments
        setComments(commentsData);
      } catch (error) {
        console.error("Error fetching reactions/comments:", error);
      } finally {
        setCommentsLoading(false);
      }
    };

    fetchReactionsAndComments();
  }, [documentId, userId]);

  // Handle adding or changing reaction
  const handleReactionChange = async (emoji: string) => {
    try {
      if (userReaction === emoji) return; // No change if the same emoji is clicked

      await fetch(`/api/reactions/id?id=${documentId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ documentId, userId, emoji }),
      });

      setReactions((prev) => {
        const newReactions = { ...prev };
        if (userReaction) newReactions[userReaction] = (newReactions[userReaction] || 0) - 1;
        newReactions[emoji] = (newReactions[emoji] || 0) + 1;
        return newReactions;
      });

      setUserReaction(emoji);
    } catch (error) {
      console.error("Error changing reaction:", error);
    }
  };

  // Handle showing reaction panel
  const handleMouseEnterReaction = () => {
    setShowReactionsPanel(true);
  };

  const handleMouseLeaveReaction = () => {
    setShowReactionsPanel(false);
  };

  // Handle adding comment
  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    setLoading(true);
    try {
      await fetch(`/api/comments/id?id=${documentId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ documentId, userId, content: newComment }),
      });

      setComments((prev) => [
        {
          id: Date.now(),
          user_name: "You",
          content: newComment,
          created_at: new Date(),
        },
        ...prev,
      ]);

      setNewComment("");
    } catch (error) {
      console.error("Error adding comment:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      {/* Reactions Section */}
      <div className="relative flex items-center space-x-4 mb-4">
        <div
          className="relative"
          onMouseEnter={handleMouseEnterReaction}
          onMouseLeave={handleMouseLeaveReaction}
        >
          <button className="flex items-center space-x-1 text-gray-500 hover:text-blue-500">
            <span>{userReaction || "👍"}</span>
            <span className="ml-1 z-10">{reactions[userReaction || "👍"] || 0}</span>
          </button>

          {/* Reactions Panel */}
          {showReactionsPanel && (
            <div
              ref={reactionPanelRef}
              className="absolute top-8 left-1/2 transform -translate-x-1/2 bg-white border shadow-lg rounded-md p-2 flex space-x-2 z-10"
            >
              {EMOJIS.map(({ emoji, label }) => (
                <button
                  key={emoji}
                  className="p-1 hover:bg-gray-100 rounded-full"
                  onClick={() => handleReactionChange(emoji)}
                  onMouseEnter={() => setHoveredEmoji(emoji)}
                  onMouseLeave={() => setHoveredEmoji(null)}
                >
                  {emoji}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Tooltip */}
        {hoveredEmoji && (
          <div className="absolute top-16 text-xs bg-gray-700 text-white rounded px-2 py-1">
            {hoveredEmoji}
          </div>
        )}
      </div>

      {/* Comments Section */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Comments</h3>
        {commentsLoading ? (
          <Spinner />
        ) : (
          <div className="space-y-2">
            {comments.map((comment) => (
              <div
                key={comment.id}
                className="p-2 bg-gray-100 rounded-lg shadow-sm"
              >
                <div className="text-sm text-gray-600 font-medium">
                  {comment.user_name}
                </div>
                <div className="text-gray-800">{comment.content}</div>
                <div className="text-xs text-gray-400">
                  {new Date(comment.created_at).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Comment */}
      <div className="flex items-center space-x-2">
        <input
          type="text"
          className="flex-1 p-2 border rounded-lg text-sm"
          placeholder="Add a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm disabled:bg-gray-300"
          onClick={handleAddComment}
          disabled={loading}
        >
          {loading ? <Spinner /> : "Post"}
        </button>
      </div>
    </div>
  );
};

export default CommentsAndReactions;
