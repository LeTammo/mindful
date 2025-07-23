import React from 'react';

interface FileMatchSuggestionItemProps {
    path: string;
    line?: string;
    i: number;
    selectedSuggestion: number;
    selectSuggestion: (idx: number) => void;
}

const FileMatchItem = ({ path, line, i, selectedSuggestion, selectSuggestion }: FileMatchSuggestionItemProps) => (
    <div
        key={i}
        className={`px-4 py-2 cursor-pointer ${selectedSuggestion === i ? 'bg-gray-700 text-white' : 'text-gray-300'} hover:bg-gray-700 hover:text-white`}
        onClick={() => selectSuggestion(i)}
    >
        {path}{line ? `: ${line}` : ''}
    </div>
);

export default FileMatchItem;

