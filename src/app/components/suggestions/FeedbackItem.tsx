import React from 'react';

interface FeedbackSuggestionItemProps {
    message: string;
    i: number;
}

const FeedbackItem = ({ message, i }: FeedbackSuggestionItemProps) => (
    <div key={i} className="px-4 py-2 text-yellow-400 font-mono text-base">{message}</div>
);

export default FeedbackItem;

