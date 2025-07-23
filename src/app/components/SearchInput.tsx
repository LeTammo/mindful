import React from 'react';
import { Suggestion } from './types';
import FeedbackItem from './suggestions/FeedbackItem';
import FileMatchItem from './suggestions/FileMatchItem';

interface SearchInputProps {
    inputRef: React.RefObject<HTMLInputElement | null>;
    query: string;
    setQuery: React.Dispatch<React.SetStateAction<string>>;
    handleKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
    suggestions: Suggestion[];
    selectedSuggestion: number;
    selectSuggestion: (idx: number) => void;
}

export function SearchInput({
    inputRef,
    query,
    setQuery,
    handleKeyDown,
    suggestions,
    selectedSuggestion,
    selectSuggestion
}: SearchInputProps) {
    return (
        <div className="mt-4 flex flex-col items-center">
            <div className="flex items-center w-full">
                <span className="font-mono text-green-500 text-lg">SEARCH&gt;</span>
                <input
                    ref={inputRef as React.RefObject<HTMLInputElement>}
                    type="text"
                    autoComplete="off"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="flex-1 bg-transparent border-none outline-none text-gray-200 ml-2 text-lg"
                    autoFocus
                />
            </div>
            {suggestions.length > 0 && (
                <div className="bg-gray-800 rounded-md mt-2 shadow-lg max-h-48 overflow-y-auto w-full">
                    {suggestions.map((s, i) =>
                        s.type === 'feedback' ? (
                            <FeedbackItem key={i} message={s.message} i={i} />
                        ) : (
                            <FileMatchItem
                                key={i}
                                path={s.path}
                                line={s.line}
                                i={i}
                                selectedSuggestion={selectedSuggestion}
                                selectSuggestion={selectSuggestion}
                            />
                        )
                    )}
                </div>
            )}
        </div>
    );
}
