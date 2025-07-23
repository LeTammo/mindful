import React from 'react';

const FeedbackOutput = ({ message }: { message: string }) => (
    <div className="pl-4 text-yellow-400 font-mono text-base bg-yellow-900/10 rounded">
        {message}
    </div>
);

export default FeedbackOutput;

