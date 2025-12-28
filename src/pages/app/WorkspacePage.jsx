import React, { useState } from 'react';
import Sidebar from '../../Components/Workspace/Sidebar';
import PageList from '../../Components/Workspace/PageList';
import WorkspaceSettings from '../../Components/Workspace/WorkspaceSettings';

export default function WorkspacePage() {
  const [workspaces, setWorkspaces] = useState([
    {
      id: 1,
      name: 'Personal',
      expanded: true,
      pages: [
        { id: 101, name: 'Daily Notes', content: '' },
        { id: 102, name: 'Ideas', content: '' }
      ]
    },
    {
      id: 2,
      name: 'Work Projects',
      expanded: false,
      pages: [
        { id: 201, name: 'Q1 Planning', content: '' }
      ]
    }
  ]);

  const [activePage, setActivePage] = useState(101);
  const [shareModal, setShareModal] = useState(null);

  const addWorkspace = () => {
    const id = Date.now();
    setWorkspaces([...workspaces, {
      id,
      name: 'New Workspace',
      expanded: true,
      pages: []
    }]);
  };

  const addPage = (workspaceId) => {
    const id = Date.now();
    setWorkspaces(workspaces.map(ws =>
      ws.id === workspaceId
        ? { ...ws, pages: [...ws.pages, { id, name: 'New Page', content: '' }], expanded: true }
        : ws
    ));
    setActivePage(id);
  };

  const renameItem = (type, id, workspaceId, name) => {
    if (type === 'workspace') {
      setWorkspaces(workspaces.map(ws =>
        ws.id === id ? { ...ws, name } : ws
      ));
    } else {
      setWorkspaces(workspaces.map(ws => ({
        ...ws,
        pages: ws.pages.map(p => p.id === id ? { ...p, name } : p)
      })));
    }
  };

  const deleteItem = (type, id, workspaceId) => {
    if (type === 'workspace') {
      setWorkspaces(workspaces.filter(ws => ws.id !== id));
    } else {
      setWorkspaces(workspaces.map(ws =>
        ws.id === workspaceId
          ? { ...ws, pages: ws.pages.filter(p => p.id !== id) }
          : ws
      ));
      if (activePage === id) setActivePage(null);
    }
  };

  const updatePageContent = (pageId, content) => {
    setWorkspaces(workspaces.map(ws => ({
      ...ws,
      pages: ws.pages.map(p =>
        p.id === pageId ? { ...p, content } : p
      )
    })));
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar
        workspaces={workspaces}
        setWorkspaces={setWorkspaces}
        activePage={activePage}
        setActivePage={setActivePage}
        onAddWorkspace={addWorkspace}
        onAddPage={addPage}
        onRename={renameItem}
        onDelete={deleteItem}
        onShare={(type, id) => setShareModal({ type, id })}
      />

      <PageList
        activePage={activePage}
        workspaces={workspaces}
        onUpdateContent={updatePageContent}
      />

      <WorkspaceSettings
        shareModal={shareModal}
        onClose={() => setShareModal(null)}
        onShare={(email, permission) =>
          alert(`Shared with ${email} (${permission})`)
        }
      />
    </div>
  );
}
