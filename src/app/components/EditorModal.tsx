import React from 'react';

interface EditorModalProps {
    showEditor: boolean;
    editorRef: React.RefObject<HTMLTextAreaElement | null>;
    editorContent: string;
    setEditorContent: React.Dispatch<React.SetStateAction<string>>;
    handleSave: () => void;
    setShowEditor: React.Dispatch<React.SetStateAction<boolean>>;
}

export function EditorModal({ showEditor, editorRef, editorContent, setEditorContent, handleSave, setShowEditor }: EditorModalProps) {
    if (!showEditor) return null;
    return (
        <div className="flex-col flex-1 mt-4">
            <textarea
                id="editFileContent"
                ref={editorRef as React.RefObject<HTMLTextAreaElement>}
                value={editorContent}
                onChange={(e) => setEditorContent(e.target.value)}
                onKeyDown={(e) => {
                    if (e.ctrlKey && e.key === 'Enter') {
                        e.preventDefault();
                        handleSave();
                    }
                }}
                className="w-full flex-1 p-3 bg-gray-800 text-gray-100 rounded-md resize-none border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            ></textarea>
            <div className="flex justify-end mt-3">
                <button onClick={handleSave} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">Save</button>
                <button onClick={() => setShowEditor(false)} className="px-4 py-2 ml-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition-colors">Cancel</button>
            </div>
        </div>
    );
}
