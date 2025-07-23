'use client';

import { useState, useEffect, useRef } from 'react';
import { TerminalOutput } from './components/TerminalOutput';
import { SearchInput } from './components/SearchInput';
import { OutputItem, Suggestion } from './components/types';

export default function Home() {
    const [query, setQuery] = useState<string>('');
    const [lastQuery, setLastQuery] = useState<string>('');
    const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
    const [selectedSuggestion, setSelectedSuggestion] = useState<number>(-1);
    const [editingPath, setEditingPath] = useState<string | null>(null);
    const [output, setOutput] = useState<OutputItem[]>([]);
    const [showEditor, setShowEditor] = useState<boolean>(false);

    const inputRef = useRef<HTMLInputElement>(null);
    const outputRef = useRef<HTMLDivElement>(null);
    const editorRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        if (!showEditor) {
            inputRef.current?.focus();
        }
    }, [showEditor]);

    useEffect(() => {
        if (showEditor) {
            editorRef.current?.focus();
        }
    }, [showEditor]);

    useEffect(() => {
        if (outputRef.current) {
            outputRef.current.scrollTop = outputRef.current.scrollHeight;
        }
    }, [output]);

    useEffect(() => {
        const debounceTimer = setTimeout(() => {
            if (query === lastQuery) return;
            setLastQuery(query);
            if (!query) {
                setSuggestions([]);
                return;
            }
            fetch(`/api/search?q=${encodeURIComponent(query)}`)
                .then(res => res.json())
                .then(data => {
                    setSuggestions(data);
                });
        }, 250);

        return () => clearTimeout(debounceTimer);
    }, [query, lastQuery]);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (suggestions.length) {
            if (e.key === 'ArrowDown') {
                setSelectedSuggestion(prev => Math.min(prev + 1, suggestions.length - 1));
                e.preventDefault();
            } else if (e.key === 'ArrowUp') {
                setSelectedSuggestion(prev => Math.max(prev - 1, 0));
                e.preventDefault();
            } else if (e.key === 'Enter' && selectedSuggestion >= 0) {
                selectSuggestion(selectedSuggestion);
                e.preventDefault();
                setQuery('');
                return;
            }
        }
        if (e.key === 'Enter') {
            handleEnter(query);
            e.preventDefault();
        }
    };

    const handleEnter = (query: string) => {
        fetch(`/api/search?q=${encodeURIComponent(query)}`)
            .then(res => res.json())
            .then(results => {
                setOutput(prev => [...prev, { type: 'command', query }, ...results]);
                setQuery('');
                setSuggestions([]);
            });
    };

    const selectSuggestion = (idx: number) => {
        const s = suggestions[idx];
        if (!s) return;
        if (s.type !== 'file-match') return;
        setQuery(s.path);
        setSuggestions([]);
        fetch(`/api/note?path=${encodeURIComponent(s.path)}`)
            .then(res => res.json())
            .then(data => {
                setOutput(prev => [
                    ...prev,
                    { type: 'command', query: `CAT ${s.path}` },
                    { type: 'content', content: data.content, path: s.path },
                    { type: 'edit-button', path: s.path, content: data.content }
                ]);
            });
        inputRef.current?.focus();
    };

    const handleSaveEdit = (newContent: string) => {
        if (!editingPath) return;
        fetch('/api/note', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ path: editingPath, content: newContent })
        })
            .then(res => res.json())
            .then(() => {
                fetch(`/api/note?path=${encodeURIComponent(editingPath)}`)
                    .then(res => res.json())
                    .then(data => {
                        setOutput(prev => prev.map(o =>
                            o.type === 'content' && o.path === editingPath
                                ? { ...o, content: data.content }
                                : o
                        ));
                        setOutput(prev => [
                            ...prev,
                            { type: 'command', query: `EDIT ${editingPath}` },
                            { type: 'feedback', message: 'Änderungen gespeichert.' }
                        ]);
                        setEditingPath(null);
                    });
            });
    };
    const handleCancelEdit = () => {
        setEditingPath(null);
    };

    const handleContainerClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            inputRef.current?.focus();
        }
    };

    return (
        <div className="bg-gray-800 min-h-screen flex flex-col p-8" onClick={handleContainerClick}>
            <div className="w-full h-full flex justify-center">
                <div className="bg-gray-900 rounded-lg shadow-xl p-6 flex flex-col flex-1 max-w-2xl w-full">
                    <TerminalOutput
                        output={output}
                        setEditingPath={setEditingPath}
                        setEditorContent={() => {}} // Fix: provide a no-op function
                        setShowEditor={setShowEditor}
                        outputRef={outputRef}
                        editingPath={editingPath}
                        onSaveEdit={handleSaveEdit}
                        onCancelEdit={handleCancelEdit}
                    />
                    <SearchInput
                        inputRef={inputRef}
                        query={query}
                        setQuery={setQuery}
                        handleKeyDown={handleKeyDown}
                        suggestions={suggestions}
                        selectedSuggestion={selectedSuggestion}
                        selectSuggestion={selectSuggestion}
                    />
                </div>
            </div>
        </div>
    );
}