// components/PostItem.tsx
import React, { useState } from "react";
import { EMOJIS } from "../constants/emojis";

 interface PostItemProps {
  post: {
    id: number;
    title: string;
    content: string;
    reactions: Record<string, number>; // Reactions per emoji (e.g., { 👍: 5, ❤️: 3 })
    comments: number;
  };
}

const PostItem: React.FC<PostItemProps> = ({ post }) => {
  const [reactions, setReactions] = useState(post.reactions);

  const handleReaction = (emoji: string) => {
    setReactions((prevReactions) => ({
      ...prevReactions,
      [emoji]: (prevReactions[emoji] || 0) + 1,
    }));
  };

  return (
    <div className="p-4 bg-white border rounded-lg shadow-sm">
      <h3 className="text-lg font-semibold">{post.title}</h3>
      <p className="mt-2 text-gray-600">{post.content}</p>

      {/* Emoji Reactions */}
      <div className="flex items-center justify-start mt-4 space-x-4">
        {EMOJIS.map(({ emoji, label }) => (
          <button
            key={emoji}
            className="flex items-center space-x-1 text-gray-500 hover:text-blue-500"
            onClick={() => handleReaction(emoji)}
          >
            <span>{emoji}</span>
            <span>{reactions[emoji] || 0}</span>
          </button>
        ))}
      </div>

      {/* Comments Section */}
      <div className="flex items-center justify-between mt-4 text-sm text-gray-500">
        <button className="flex items-center space-x-1 hover:text-blue-500">
          <span>💬</span>
          <span>{post.comments}</span>
        </button>
      </div>
    </div>
  );
};

export default PostItem;
