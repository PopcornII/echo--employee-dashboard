import React, { useState, useEffect } from "react";
import Spinner from "./Spinner";
import { formatDate } from "./FormatDate";

interface Comment {
  id: number;
  user_name: string;
  content: string;
  created_at: string;
}

interface Reaction {
  emoji: string;
  count: number;
  userId?: number;
}

interface CommentsProps {
  documentId: number;
  userId: number;
  
}

const Comments: React.FC<CommentsProps> = ({
  documentId,
  userId,
}) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [commentsLoading, setCommentsLoading] = useState(true);

  // Fetch reactions and comments
  useEffect(() => {
    const fetchReactionsAndComments = async () => {
      try {
        const [commentRes] = await Promise.all([
          fetch(`/api/comments/id?id=${documentId}`,{ method: 'GET' })
        ]);
        const commentsData: Comment[] = await commentRes.json();

        console.log("Comments Data:", commentsData); // Debugging log

        const reactionMap: Record<string, number> = {};

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
          created_at: "",
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
    <div>
      {/* Comments Section */}
      <div className="mb-2">
        <h3 className="text-sm font-bold text-gray-800 mb-2">Comments</h3>
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
                  {formatDate(comment.created_at)}
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

export default Comments;
