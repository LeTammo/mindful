import React from 'react';

const CommandOutput = ({ query }: { query: string }) => (
    <div className="flex items-center gap-2">
        <span className="text-green-400 font-mono text-lg">SEARCH&gt;</span>
        <span className="font-mono text-lg">{query}</span>
    </div>
);

export default CommandOutput;

