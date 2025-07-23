import React from 'react';
import CommandOutput from './output/CommandOutput';
import FeedbackOutput from './output/FeedbackOutput';
import FileMatchOutput from './output/FileMatchOutput';
import ContentOutput from './output/ContentOutput';
import EditButtonOutput from './output/EditButtonOutput';
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
                        return <ContentOutput key={i} content={o.content} />;
                    case 'edit-button':
                        return <EditButtonOutput key={i} path={o.path} content={o.content}
                                                 setEditingPath={setEditingPath}
                                                 setEditorContent={setEditorContent}
                                                 setShowEditor={setShowEditor} />;
                    default:
                        return null;
                }
            })}
        </div>
    );
}
