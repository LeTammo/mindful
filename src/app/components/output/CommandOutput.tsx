import React from 'react';

const username = process.env.NEXT_PUBLIC_USERNAME || 'USER';
const CommandOutput = ({ query }: { query: string }) => (
    <div className="flex items-center gap-2">
        <span className="text-emerald-400 font-mono text-lg">{username}&gt;</span>
        <span className="font-mono text-lg">{query}</span>
    </div>
);

export default CommandOutput;
