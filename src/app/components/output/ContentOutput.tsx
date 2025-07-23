import React from 'react';

const ContentOutput = ({ content, path, setEditingPath, setEditorContent, setShowEditor, showEditor, isEditing, onSave, onCancel }: {
    content: string;
    path?: string;
    setEditingPath?: React.Dispatch<React.SetStateAction<string | null>>;
    setEditorContent?: React.Dispatch<React.SetStateAction<string>>;
    setShowEditor?: React.Dispatch<React.SetStateAction<boolean>>;
    showEditor?: boolean;
    isEditing?: boolean;
    onSave?: (value: string) => void;
    onCancel?: () => void;
}) => {
    const [editValue, setEditValue] = React.useState(content);
    const textareaRef = React.useRef<HTMLTextAreaElement>(null);
    React.useEffect(() => {
        if (isEditing) {
            setEditValue(content);
            textareaRef.current?.focus();
        }
    }, [isEditing, content]);

    const handleClick = () => {
        if (setEditingPath && setEditorContent && path && !isEditing) {
            setEditingPath(path);
            setEditorContent(content);
            if (setShowEditor) setShowEditor(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.ctrlKey && e.key === 'Enter' && onSave) {
            e.preventDefault();
            onSave(editValue);
        }
    };

    return isEditing ? (
        <div className="relative">
            <textarea
                ref={textareaRef}
                value={editValue}
                onChange={e => setEditValue(e.target.value)}
                onKeyDown={handleKeyDown}
                className="pl-4 text-gray-300 whitespace-pre-wrap text-base bg-gray-800 rounded p-2 w-full border-none outline-none resize-none font-mono shadow-inner"
                style={{ minHeight: '120px', fontFamily: 'inherit' }}
            />
            <div className="flex justify-end mt-2 gap-2">
                <button onClick={() => { setEditValue(content); if (onCancel) onCancel(); }} className="px-3 py-1 bg-gray-700 text-white rounded hover:bg-gray-600">Cancel</button>
                <button onClick={() => onSave && onSave(editValue)} className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700">Save</button>
            </div>
        </div>
    ) : (
        <pre
            className="pl-4 text-gray-300 whitespace-pre-wrap text-base bg-gray-800 rounded p-2 cursor-pointer"
            onClick={handleClick}
        >
            {content}
        </pre>
    );
};

export default ContentOutput;
