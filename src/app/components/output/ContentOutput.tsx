import React from 'react';

const ContentOutput = ({ content, path, setEditingPath, setEditorContent, setShowEditor, showEditor }: {
    content: string;
    path?: string;
    setEditingPath?: React.Dispatch<React.SetStateAction<string | null>>;
    setEditorContent?: React.Dispatch<React.SetStateAction<string>>;
    setShowEditor?: React.Dispatch<React.SetStateAction<boolean>>;
    showEditor?: boolean;
}) => {
    const handleClick = () => {
        if (setEditingPath && setEditorContent && setShowEditor && path && !showEditor) {
            setEditingPath(path);
            setEditorContent(content);
            setShowEditor(true);
        }
    };
    return (
        <pre
            className="pl-4 text-gray-300 whitespace-pre-wrap text-base bg-gray-800 rounded p-2 cursor-pointer"
            onClick={handleClick}
        >
            {content}
        </pre>
    );
};

export default ContentOutput;
