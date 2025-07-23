import React from 'react';

const ContentOutput = ({ content }: { content: string }) => (
    <pre className="pl-4 text-gray-300 whitespace-pre-wrap text-base bg-gray-800 rounded p-2">
        {content}
    </pre>
);

export default ContentOutput;

