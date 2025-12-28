import React, { useState, useRef, useEffect } from 'react';
import { Search, Plus, MoreVertical, ChevronRight, ChevronDown, LogOut, File, Folder } from 'lucide-react';

export default function Sidebar({ 
  workspaces, 
  setWorkspaces, 
  activePage, 
  setActivePage,
  onAddWorkspace,
  onAddPage,
  onRename,
  onDelete,
  onShare
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [menuOpen, setMenuOpen] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState('');
  
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleWorkspace = (id) => {
    setWorkspaces(workspaces.map(ws => 
      ws.id === id ? { ...ws, expanded: !ws.expanded } : ws
    ));
  };

  const handleRename = (type, id, workspaceId = null) => {
    if (type === 'workspace') {
      const ws = workspaces.find(w => w.id === id);
      setEditingId(`ws-${id}`);
      setEditingName(ws.name);
    } else {
      const ws = workspaces.find(w => w.id === workspaceId);
      const page = ws.pages.find(p => p.id === id);
      setEditingId(`pg-${id}`);
      setEditingName(page.name);
    }
    setMenuOpen(null);
  };

  const saveRename = () => {
    if (!editingName.trim()) return;
    
    if (editingId.startsWith('ws-')) {
      const id = parseInt(editingId.replace('ws-', ''));
      onRename('workspace', id, null, editingName);
    } else {
      const id = parseInt(editingId.replace('pg-', ''));
      const workspace = workspaces.find(ws => ws.pages.some(p => p.id === id));
      onRename('page', id, workspace.id, editingName);
    }
    setEditingId(null);
    setEditingName('');
  };

  const filteredWorkspaces = workspaces.map(ws => ({
    ...ws,
    pages: ws.pages.filter(p => 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ws.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(ws => 
    ws.name.toLowerCase().includes(searchQuery.toLowerCase()) || ws.pages.length > 0
  );

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col h-screen">
      {/* Search */}
      <div className="p-3 border-b border-gray-200">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Add Workspace */}
      <div className="p-3 border-b border-gray-200">
        <button
          onClick={onAddWorkspace}
          className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Workspace
        </button>
      </div>

      {/* Workspaces & Pages */}
      <div className="flex-1 overflow-y-auto p-2">
        {filteredWorkspaces.map(workspace => (
          <div key={workspace.id} className="mb-1">
            <div className="group flex items-center gap-1 px-2 py-1.5 hover:bg-gray-100 rounded-lg cursor-pointer relative">
              <button
                onClick={() => toggleWorkspace(workspace.id)}
                className="flex items-center gap-1 flex-1 min-w-0"
              >
                {workspace.expanded ? 
                  <ChevronDown className="w-4 h-4 text-gray-500 shrink-0" /> : 
                  <ChevronRight className="w-4 h-4 text-gray-500 shrink-0" />
                }
                <Folder className="w-4 h-4 text-gray-500 shrink-0" />
                {editingId === `ws-${workspace.id}` ? (
                  <input
                    autoFocus
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    onBlur={saveRename}
                    onKeyDown={(e) => e.key === 'Enter' && saveRename()}
                    className="flex-1 text-sm font-medium bg-white border border-blue-500 rounded px-1 outline-none"
                    onClick={(e) => e.stopPropagation()}
                  />
                ) : (
                  <span className="text-sm font-medium text-gray-900 truncate">{workspace.name}</span>
                )}
              </button>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={(e) => { e.stopPropagation(); onAddPage(workspace.id); }}
                  className="p-1 hover:bg-gray-200 rounded"
                  title="Add page"
                >
                  <Plus className="w-3.5 h-3.5 text-gray-600" />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); setMenuOpen(`ws-${workspace.id}`); }}
                  className="p-1 hover:bg-gray-200 rounded"
                >
                  <MoreVertical className="w-3.5 h-3.5 text-gray-600" />
                </button>
              </div>
              {menuOpen === `ws-${workspace.id}` && (
                <div ref={menuRef} className="absolute right-0 top-full mt-1 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                  <button
                    onClick={() => handleRename('workspace', workspace.id)}
                    className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 first:rounded-t-lg"
                  >
                    Rename
                  </button>
                  <button
                    onClick={() => { onShare('workspace', workspace.id); setMenuOpen(null); }}
                    className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100"
                  >
                    Share
                  </button>
                  <button
                    onClick={() => { onDelete('workspace', workspace.id); setMenuOpen(null); }}
                    className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 last:rounded-b-lg"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>

            {workspace.expanded && (
              <div className="ml-4 mt-0.5 space-y-0.5">
                {workspace.pages.map(page => (
                  <div
                    key={page.id}
                    className={`group flex items-center gap-2 px-2 py-1.5 rounded-lg cursor-pointer relative ${
                      activePage === page.id ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-100'
                    }`}
                    onClick={() => setActivePage(page.id)}
                  >
                    <File className="w-3.5 h-3.5 shrink-0" />
                    {editingId === `pg-${page.id}` ? (
                      <input
                        autoFocus
                        value={editingName}
                        onChange={(e) => setEditingName(e.target.value)}
                        onBlur={saveRename}
                        onKeyDown={(e) => e.key === 'Enter' && saveRename()}
                        className="flex-1 text-sm bg-white border border-blue-500 rounded px-1 outline-none"
                        onClick={(e) => e.stopPropagation()}
                      />
                    ) : (
                      <span className="text-sm truncate flex-1">{page.name}</span>
                    )}
                    <button
                      onClick={(e) => { e.stopPropagation(); setMenuOpen(`pg-${page.id}-${workspace.id}`); }}
                      className="p-1 hover:bg-gray-200 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <MoreVertical className="w-3.5 h-3.5" />
                    </button>
                    {menuOpen === `pg-${page.id}-${workspace.id}` && (
                      <div ref={menuRef} className="absolute right-0 top-full mt-1 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                        <button
                          onClick={() => handleRename('page', page.id, workspace.id)}
                          className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 first:rounded-t-lg"
                        >
                          Rename
                        </button>
                        <button
                          onClick={() => { onShare('page', page.id); setMenuOpen(null); }}
                          className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100"
                        >
                          Share
                        </button>
                        <button
                          onClick={() => { onDelete('page', page.id, workspace.id); setMenuOpen(null); }}
                          className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 last:rounded-b-lg"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Logout */}
      <div className="p-3 border-t border-gray-200">
        <button
          onClick={() => alert('Logged out')}
          className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </div>
  );
}
