'use client';

import { useState, useEffect, useRef } from 'react';

export default function Home() {
    const [query, setQuery] = useState('');
    const [lastQuery, setLastQuery] = useState('');
    const [suggestions, setSuggestions] = useState<any[]>([]);
    const [selectedSuggestion, setSelectedSuggestion] = useState(-1);
    const [editingPath, setEditingPath] = useState<string | null>(null);
    const [editorContent, setEditorContent] = useState('');
    const [output, setOutput] = useState<any[]>([]);
    const [showEditor, setShowEditor] = useState(false);

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
        setQuery(s.path);
        setSuggestions([]);
        if (s.type === 'file-match') {
            fetch(`/api/note?path=${encodeURIComponent(s.path)}`)
                .then(res => res.json())
                .then(data => {
                    setOutput(prev => [
                        ...prev,
                        { type: 'command', query: `CAT ${s.path}` },
                        { type: 'content', content: data.content },
                        { type: 'edit-button', path: s.path, content: data.content }
                    ]);
                });
        }
        inputRef.current?.focus();
    };

    const handleSave = () => {
        if (!editingPath) return;
        fetch('/api/note', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ path: editingPath, content: editorContent })
        })
            .then(res => res.json())
            .then(() => {
                setOutput(prev => [
                    ...prev,
                    { type: 'command', query: `EDIT ${editingPath}` },
                    { type: 'feedback', message: 'Änderungen gespeichert.' }
                ]);
                setShowEditor(false);
                setEditingPath(null);
            });
    };

    const handleContainerClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            inputRef.current?.focus();
        }
    };

    return (
        <div className="bg-gray-900 text-gray-100 min-h-screen flex flex-col items-center justify-center" onClick={handleContainerClick}>
            <div className="w-full max-w-xl mx-auto mt-8">
                <div className="bg-black rounded-lg shadow-lg p-4 flex flex-col h-[500px] relative">
                    <div ref={outputRef} className="flex-1 overflow-y-auto text-sm mb-4">
                        {output.map((o, i) => {
                            if (o.type === 'command') {
                                return <div key={i}><span className='text-green-400 font-mono'>SEARCH&gt; {o.query}</span></div>;
                            }
                            if (o.type === 'feedback') {
                                return <div key={i} className='pl-4 text-yellow-400 font-mono'>{o.message}</div>;
                            }
                            if (o.type === 'file-match') {
                                return <div key={i} className='pl-4'><span className='text-green-300'>{o.path}</span>{o.line ? `: <span className="text-gray-300">${o.line}</span>` : ''}</div>;
                            }
                            if (o.type === 'content') {
                                return <pre key={i} className='pl-4 text-gray-200 whitespace-pre-wrap'>{o.content}</pre>;
                            }
                            if (o.type === 'edit-button') {
                                return <button key={i} className='mt-2 px-3 py-1 bg-blue-600 text-white rounded' onClick={() => {
                                    setEditingPath(o.path);
                                    setEditorContent(o.content);
                                    setShowEditor(true);
                                }}>Bearbeiten</button>;
                            }
                            return null;
                        })}
                    </div>
                    {showEditor && (
                        <div className="flex-col h-full">
                            <textarea
                                ref={editorRef}
                                value={editorContent}
                                onChange={(e) => setEditorContent(e.target.value)}
                                className="w-full h-64 p-2 bg-gray-800 text-gray-100 rounded resize-none border border-gray-700"
                            ></textarea>
                            <div className="flex justify-end mt-2">
                                <button onClick={handleSave} className="px-3 py-1 bg-blue-600 text-white rounded">Save</button>
                                <button onClick={() => setShowEditor(false)} className="px-3 py-1 ml-2 bg-gray-700 text-white rounded">Cancel</button>
                            </div>
                        </div>
                    )}
                    <div className="absolute bottom-0 left-0 w-full flex flex-col">
                        <div className="flex items-center">
                            <span className="font-mono text-green-400">SEARCH&gt;</span>
                            <input
                                ref={inputRef}
                                type="text"
                                autoComplete="off"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                onKeyDown={handleKeyDown}
                                className="flex-1 bg-transparent border-none outline-none text-gray-100 ml-2 font-mono"
                                autoFocus
                            />
                        </div>
                        {suggestions.length > 0 && (
                            <div className="bg-gray-800 rounded mt-1 shadow-lg max-h-40 overflow-y-auto">
                                {suggestions.map((s, i) => {
                                    if (s.type === 'feedback') {
                                        return <div key={i} className='px-2 py-1 text-yellow-400 font-mono'>{s.message}</div>;
                                    }
                                    return (
                                        <div
                                            key={i}
                                            className={`px-2 py-1 cursor-pointer ${selectedSuggestion === i ? 'bg-gray-700' : ''}`}
                                            onClick={() => selectSuggestion(i)}
                                        >
                                            {s.path}{s.line ? `: ${s.line}` : ''}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}