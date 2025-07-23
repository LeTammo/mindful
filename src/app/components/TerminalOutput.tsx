import React, { useEffect } from 'react';
import CommandOutput from './output/CommandOutput';
import FeedbackOutput from './output/FeedbackOutput';
import FileMatchOutput from './output/FileMatchOutput';
import ContentOutput from './output/ContentOutput';
import {OutputItem} from './types';

interface TerminalOutputProps {
    output: OutputItem[];
    setEditingPath: React.Dispatch<React.SetStateAction<string | null>>;
    setEditorContent: React.Dispatch<React.SetStateAction<string>>;
    setShowEditor: React.Dispatch<React.SetStateAction<boolean>>;
    outputRef: React.RefObject<HTMLDivElement | null>;
}

export function TerminalOutput({
    output,
    setEditingPath,
    setEditorContent,
    setShowEditor,
    outputRef
}: TerminalOutputProps) {
    const lastEditableIndex = [...output].reverse().findIndex(o => o.type === 'content');
    const lastEditable = lastEditableIndex !== -1 ? output.length - 1 - lastEditableIndex : null;

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowUp' && lastEditable !== null && e.target instanceof HTMLInputElement && e.target.className !== 'editFileContent') {
                const o = output[lastEditable];
                setEditingPath(o.path || '');
                setEditorContent(o.content);
                setShowEditor(true);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [output, lastEditable, setEditingPath, setEditorContent, setShowEditor]);

    return (
        <div ref={outputRef as React.RefObject<HTMLDivElement>}
             className="flex-1 overflow-y-auto text-base text-gray-300 flex-grow space-y-2">
            {output.map((o, i) => {
                switch (o.type) {
                    case 'command':
                        return <CommandOutput key={i} query={o.query} />;
                    case 'feedback':
                        return <FeedbackOutput key={i} message={o.message} />;
                    case 'file-match':
                        return <FileMatchOutput key={i} path={o.path} line={o.line} />;
                    case 'content':
                        return <ContentOutput key={i} content={o.content} path={o.path}
                            setEditingPath={setEditingPath}
                            setEditorContent={setEditorContent}
                            setShowEditor={setShowEditor}
                        />;
                    default:
                        return null;
                }
            })}
        </div>
    );
}
