import React from 'react';
import { File } from 'lucide-react';

export default function PageList({ activePage, workspaces, onUpdateContent }) {

  const execCommand = (command, value = null) => {
    const editor = document.querySelector('[contenteditable="true"]');
    if (!editor) return;

    editor.focus();

    if (command === 'formatBlock') {
      document.execCommand(command, false, value);
    } else {
      document.execCommand(command, false, value);
    }
  };

  const getActivePageContent = () => {
    for (const ws of workspaces) {
      const page = ws.pages.find(p => p.id === activePage);
      if (page) return page;
    }
    return null;
  };

  const activePageData = getActivePageContent();

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {activePageData ? (
        <>
          {/* Toolbar */}
          <div className="border-b border-gray-200 bg-white px-6 py-3">
            <div className="flex items-center gap-2 mb-3">
              <button
                onMouseDown={(e) => { e.preventDefault(); execCommand('bold'); }}
                className="px-3 py-1.5 text-sm font-semibold hover:bg-gray-100 rounded border"
              >
                B
              </button>
              <button
                onMouseDown={(e) => { e.preventDefault(); execCommand('underline'); }}
                className="px-3 py-1.5 text-sm underline hover:bg-gray-100 rounded border"
              >
                U
              </button>
              <button
                onMouseDown={(e) => { e.preventDefault(); execCommand('formatBlock', 'h1'); }}
                className="px-3 py-1.5 text-sm font-bold hover:bg-gray-100 rounded border"
              >
                H1
              </button>
              <button
                onMouseDown={(e) => { e.preventDefault(); execCommand('formatBlock', 'h2'); }}
                className="px-3 py-1.5 text-sm font-bold hover:bg-gray-100 rounded border"
              >
                H2
              </button>
              <button
                onMouseDown={(e) => { e.preventDefault(); execCommand('formatBlock', 'p'); }}
                className="px-3 py-1.5 text-sm hover:bg-gray-100 rounded border"
              >
                P
              </button>
            </div>

            <h2 className="text-sm font-medium text-gray-500">
              Editing: {activePageData.name}
            </h2>
          </div>

          {/* Editor */}
          <div className="flex-1 overflow-y-auto p-6">
            <div
              contentEditable
              suppressContentEditableWarning
              onBlur={(e) =>
                onUpdateContent(activePage, e.currentTarget.innerHTML)
              }
              dangerouslySetInnerHTML={{ __html: activePageData.content }}
              className="max-w-3xl mx-auto prose prose-sm focus:outline-none min-h-full"
            />
          </div>
        </>
      ) : (
        <div className="flex-1 flex items-center justify-center text-gray-400">
          <div className="text-center">
            <File className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p className="text-lg">Select a page to start editing</p>
          </div>
        </div>
      )}
    </div>
  );
}
