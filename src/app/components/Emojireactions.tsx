import React from 'react';
import { EMOJIS } from '../constants/emojis';

const EmojiReactions = ({ onReact }) => (
    <div style={{ display: 'flex', gap: '10px' }}>
        {EMOJIS.map((emoji) => (
            <button
                key={emoji.label}
                onClick={() => onReact(emoji.label)}
                style={{
                    fontSize: '1.5rem',
                    cursor: 'pointer',
                    background: 'none',
                    border: 'none',
                }}
            >
                {emoji.emoji}
            </button>
        ))}
    </div>
);

export default EmojiReactions;
