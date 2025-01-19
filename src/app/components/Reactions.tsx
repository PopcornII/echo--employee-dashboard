import React, { useState, useEffect, useRef } from "react";
import { EMOJIS } from "../constants/emojis";


interface userReactions {
      emoji: string;
}
interface  reactionCounts {
    emoji: string;
    totalReactionscount: number;
}


interface Reactionsicon {
    emoji: string;
    count: number;
}

interface ReactionsProps {
  documentId: number;
  userId: number;
 
  
}

const Reactions: React.FC<ReactionsProps> = ({
  documentId,
  userId,
}) => {
  const [reactions, setReactions] = useState<Record<string, number>>({});
  const [userReaction, setUserReaction] = useState<string>(null);
  const [showReactionsPanel, setShowReactionsPanel] = useState(false);
  const [hoveredEmoji, setHoveredEmoji] = useState<string | null>(null);
  const reactionPanelRef = useRef<HTMLDivElement | null>(null);

  // Fetch reactions and comments
  useEffect(() => {
    const fetchReactions = async () => {
      try {
        const [reactionRes] = await Promise.all([
          fetch(`api/reactions/id?id=${documentId}&userId=${userId}`)
        ]);
        const { userReaction, reactionCounts } = await reactionRes.json();

        const reactionMap: Record<string, number> = {};
        reactionCounts.forEach(({ emoji, count }: { emoji: string; count: number }) => {
        reactionMap[emoji] = count;
      });
        setReactions(reactionMap);

        // Process user reaction
        const userEmoji = userReaction[0]?.emoji || null;
        console.log('User Emoji: '+ userEmoji);
        setUserReaction(userEmoji);

      } catch (error) {
        console.error("Error fetching reactions", error);
      }
    };

    fetchReactions();
  }, [documentId, userId]);

  // Handle adding or changing reaction
  const handleReactionChange = async (emoji: string) => {
    try {
      if (userReaction === emoji) return;

      await fetch(`api/reactions/id?id=${documentId}&id?id=${userId}`, {
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

  return (
    <div className="">
      {/* Reactions Section */}
      <div className="flex flex-col">
        <div
          className="absolute"
          onMouseEnter={handleMouseEnterReaction}
          onMouseLeave={handleMouseLeaveReaction}
        >
          <button className="flex flex-row-reverse items-center space-x-1 text-gray-500 hover:text-blue-500">
            <span>{userReaction ||
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-5">
                <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-2.625 6c-.54 0-.828.419-.936.634a1.96 1.96 0 0 0-.189.866c0 .298.059.605.189.866.108.215.395.634.936.634.54 0 .828-.419.936-.634.13-.26.189-.568.189-.866 0-.298-.059-.605-.189-.866-.108-.215-.395-.634-.936-.634Zm4.314.634c.108-.215.395-.634.936-.634.54 0 .828.419.936.634.13.26.189.568.189.866 0 .298-.059.605-.189.866-.108.215-.395.634-.936.634-.54 0-.828-.419-.936-.634a1.96 1.96 0 0 1-.189-.866c0-.298.059-.605.189-.866Zm2.023 6.828a.75.75 0 1 0-1.06-1.06 3.75 3.75 0 0 1-5.304 0 .75.75 0 0 0-1.06 1.06 5.25 5.25 0 0 0 7.424 0Z" clipRule="evenodd" />
              </svg>
            
           
              }</span>
            {/* <span className="ml-1 z-10">{reactions[userReaction || "👍"] || 0}</span> */}
          </button>

          {/* Reactions Panel */}
          {showReactionsPanel && (
            <div
              ref={reactionPanelRef}
              className="relative top-0 left-1/2 transform -translate-x-1/2 bg-white border shadow-lg rounded-md p-2 flex space-x-2 z-10"
            >
              {EMOJIS.map(({ emoji, label }) => (
                <button
                  key={emoji}
                  className=" hover:bg-gray-100 rounded-full"
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
          <div className="absolute top-0 text-xs bg-gray-700 text-white rounded px-2 py-1">
            {hoveredEmoji}
          </div>
        )}
      </div>
    </div>
  );
};

export default Reactions;
