import React from 'react';

const FileMatchOutput = ({ path, line }: { path: string; line?: string }) => (
    <div className="pl-4 text-base flex gap-2 items-center">
        <span className="text-green-300 font-mono">{path}</span>
        {line && <span className="text-gray-400 font-mono">: {line}</span>}
    </div>
);

export default FileMatchOutput;

