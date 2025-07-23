import React from 'react';

interface EditButtonOutputProps {
    path: string;
    content: string;
    setEditingPath: React.Dispatch<React.SetStateAction<string | null>>;
    setEditorContent: React.Dispatch<React.SetStateAction<string>>;
    setShowEditor: React.Dispatch<React.SetStateAction<boolean>>;
}

const EditButtonOutput = ({ path, content, setEditingPath, setEditorContent, setShowEditor }: EditButtonOutputProps) => (
    <button
        className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-mono"
        onClick={() => {
            setEditingPath(path);
            setEditorContent(content);
            setShowEditor(true);
        }}
    >Edit</button>
);

export default EditButtonOutput;

