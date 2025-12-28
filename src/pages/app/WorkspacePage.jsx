import { useEffect, useMemo, useState } from "react";
import { useQuery, useMutation } from "@apollo/client/react";

import Sidebar from "../../Components/Workspace/Sidebar";
import WorkspaceSettings from "../../Components/Workspace/WorkspaceSettings";
import Editor from "../../Components/Page/Editor";

import useWorkspace from "../../hooks/useWorkspace";

import { ME, WORKSPACE, WORKSPACES } from "../../graphql/queries/workspace";
import { PAGE } from "../../graphql/queries/page";
import { BLOCKS } from "../../graphql/queries/block";

import {
  CREATE_WORKSPACE,
  ADD_WORKSPACE_MEMBER,
  UPDATE_WORKSPACE_MEMBER_ROLE,
  REMOVE_WORKSPACE_MEMBER,
  TRANSFER_WORKSPACE_OWNERSHIP,
} from "../../graphql/mutations/workspace";
import { CREATE_PAGE, UPDATE_PAGE } from "../../graphql/mutations/page";
import { CREATE_BLOCK, UPDATE_BLOCK, DELETE_BLOCK_TREE } from "../../graphql/mutations/block";

export default function WorkspacePage() {
  const { workspaceId, pageId, openWorkspace, openPage } = useWorkspace();
  const [settingsOpen, setSettingsOpen] = useState(false);

  const wsQuery = useQuery(WORKSPACES, { fetchPolicy: "cache-and-network" });
  const workspaces = wsQuery.data?.workspaces || [];

  const meQuery = useQuery(ME, { fetchPolicy: "cache-first" });
  const me = meQuery.data?.me || null;

  const activeWorkspaceId = useMemo(() => {
    if (workspaceId) return workspaceId;
    return workspaces[0]?.id || "";
  }, [workspaceId, workspaces]);

  const workspaceQuery = useQuery(WORKSPACE, {
    variables: activeWorkspaceId ? { id: activeWorkspaceId } : undefined,
    skip: !activeWorkspaceId,
    fetchPolicy: "cache-and-network",
  });
  const workspace = workspaceQuery.data?.workspace || null;
  const pages = workspace?.Pages || [];

  const activePageId = useMemo(() => {
    if (pageId) return pageId;
    return pages[0]?.id || "";
  }, [pageId, pages]);

  const pageQuery = useQuery(PAGE, {
    variables: activePageId ? { id: activePageId } : undefined,
    skip: !activePageId,
    fetchPolicy: "cache-first",
  });

  const blocksQuery = useQuery(BLOCKS, {
    variables: activePageId ? { pageId: activePageId } : undefined,
    skip: !activePageId,
    fetchPolicy: "cache-and-network",
  });
  const blocks = blocksQuery.data?.blocks || [];

  const [createWorkspace] = useMutation(CREATE_WORKSPACE, {
    refetchQueries: [{ query: WORKSPACES }],
  });
  const [createPage] = useMutation(CREATE_PAGE, {
    refetchQueries: activeWorkspaceId ? [{ query: WORKSPACE, variables: { id: activeWorkspaceId } }] : [],
  });
  const [updatePage] = useMutation(UPDATE_PAGE);

  const [addWorkspaceMember] = useMutation(ADD_WORKSPACE_MEMBER, {
    refetchQueries: activeWorkspaceId ? [{ query: WORKSPACE, variables: { id: activeWorkspaceId } }] : [],
  });
  const [updateWorkspaceMemberRole] = useMutation(UPDATE_WORKSPACE_MEMBER_ROLE, {
    refetchQueries: activeWorkspaceId ? [{ query: WORKSPACE, variables: { id: activeWorkspaceId } }] : [],
  });
  const [removeWorkspaceMember] = useMutation(REMOVE_WORKSPACE_MEMBER, {
    refetchQueries: activeWorkspaceId ? [{ query: WORKSPACE, variables: { id: activeWorkspaceId } }] : [],
  });
  const [transferWorkspaceOwnership] = useMutation(TRANSFER_WORKSPACE_OWNERSHIP, {
    refetchQueries: activeWorkspaceId
      ? [{ query: WORKSPACE, variables: { id: activeWorkspaceId } }, { query: WORKSPACES }]
      : [{ query: WORKSPACES }],
  });

  const [createBlock] = useMutation(CREATE_BLOCK, {
    refetchQueries: activePageId ? [{ query: BLOCKS, variables: { pageId: activePageId } }] : [],
  });
  const [updateBlock] = useMutation(UPDATE_BLOCK);
  const [deleteBlockTree] = useMutation(DELETE_BLOCK_TREE, {
    refetchQueries: activePageId ? [{ query: BLOCKS, variables: { pageId: activePageId } }] : [],
  });

  useEffect(() => {
    if (!workspaceId && activeWorkspaceId) {
      openWorkspace(activeWorkspaceId);
      return;
    }
    if (workspaceId && !pageId && activeWorkspaceId && activePageId) {
      openPage(activeWorkspaceId, activePageId);
    }
  }, [workspaceId, pageId, activeWorkspaceId, activePageId, openWorkspace, openPage]);

  const handleCreateWorkspace = async () => {
    const name = prompt("workspace name") || "";
    if (!name.trim()) return;
    const res = await createWorkspace({ variables: { name: name.trim() } });
    const id = res.data?.createWorkspace?.id;
    if (id) openWorkspace(id);
  };

  const handleCreatePage = async () => {
    if (!activeWorkspaceId) return;
    const title = prompt("page title") || "";
    const res = await createPage({ variables: { workspaceId: activeWorkspaceId, title: title.trim() || null } });
    const id = res.data?.createPage?.id;
    if (id) openPage(activeWorkspaceId, id);
  };

  const handleAddMember = async (workspaceIdArg, userIdArg, roleArg) => {
    await addWorkspaceMember({ variables: { workspaceId: workspaceIdArg, userId: userIdArg, role: roleArg } });
  };

  const handleUpdateRole = async (workspaceIdArg, userIdArg, roleArg) => {
    await updateWorkspaceMemberRole({ variables: { workspaceId: workspaceIdArg, userId: userIdArg, role: roleArg } });
  };

  const handleRemoveMember = async (workspaceIdArg, userIdArg) => {
    const ok = confirm("Remove this member from the workspace?");
    if (!ok) return;
    await removeWorkspaceMember({ variables: { workspaceId: workspaceIdArg, userId: userIdArg } });
  };

  const handleTransferOwnership = async (workspaceIdArg, newOwnerUserId) => {
    await transferWorkspaceOwnership({ variables: { workspaceId: workspaceIdArg, newOwnerUserId } });
  };

  const handleRenamePage = async (id, title) => {
    if (!id) return;
    const next = (title || "").trim();
    if (!next) return;
    await updatePage({ variables: { id, title: next } });
  };

  const handleCreateParagraph = async () => {
    if (!activePageId) return;
    await createBlock({
      variables: {
        pageId: activePageId,
        parentblockId: null,
        type: "PARAGRAPH",
        data: { text: "" },
      },
    });
  };

  const handleUpdateBlock = async (id, type, data) => {
    if (!id) return;
    await updateBlock({ variables: { id, type: type || "PARAGRAPH", data } });
  };

  const handleDeleteBlock = async (id) => {
    if (!id) return;
    await deleteBlockTree({ variables: { id } });
  };

  const loading = wsQuery.loading || meQuery.loading || (activeWorkspaceId && workspaceQuery.loading);
  const error = wsQuery.error || meQuery.error || workspaceQuery.error || pageQuery.error || blocksQuery.error;


  const appStyles = `
:root {
  --bg: #ffffff;
  --panel: #111827;
  --panel-2: #1f2933;
  --border: #2a3441;
  --text: #e5e7eb;
  --muted: #9ca3af;
  --primary: #6366f1;
  --danger: #ef4444;
  --radius: 12px;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  background: var(--bg);
  color: var(--text);
  font-family: Inter, system-ui, Avenir, Helvetica, Arial, sans-serif;
}

.appShell {
  display: flex;
  height: 100vh;
  overflow: hidden;
}

.main {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  background: linear-gradient(180deg, #0f172a, #020617);
}

/* ---------- UI elements ---------- */

.card {
  background: var(--panel);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 16px;
  margin-bottom: 16px;
}

.tag {
  display: inline-block;
  padding: 4px 10px;
  font-size: 12px;
  color: var(--muted);
  background: var(--panel-2);
  border-radius: 999px;
}

.errorBox {
  background: rgba(239,68,68,0.1);
  border: 1px solid var(--danger);
  border-radius: var(--radius);
  padding: 12px;
  margin-bottom: 16px;
}

.errorText {
  color: var(--danger);
  font-size: 14px;
}

/* ---------- buttons ---------- */

.btn {
  border: none;
  border-radius: 10px;
  padding: 10px 14px;
  font-size: 14px;
  cursor: pointer;
  transition: all .2s ease;
}

.btnPrimary {
  background: var(--primary);
  color: white;
}

.btnPrimary:hover {
  opacity: .9;
}

.btnSecondary {
  background: var(--panel-2);
  color: var(--text);
  border: 1px solid var(--border);
}

.btnSecondary:hover {
  background: #273449;
}

/* ---------- inputs ---------- */

.input, select {
  width: 100%;
  padding: 10px 12px;
  border-radius: 10px;
  background: #020617;
  color: var(--text);
  border: 1px solid var(--border);
  outline: none;
}

.input:focus, select:focus {
  border-color: var(--primary);
}

/* ---------- modal ---------- */

.modalOverlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
}

.modal {
  width: 100%;
  max-width: 720px;
  background: var(--panel);
  border-radius: var(--radius);
  padding: 20px;
  box-shadow: 0 20px 60px rgba(0,0,0,.6);
}

.modalHeader {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.modalTitle {
  margin: 0;
}

/* ---------- lists ---------- */

.row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid var(--border);
}

.row:last-child {
  border-bottom: none;
}

.split {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.grid2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.pill {
  padding: 4px 10px;
  font-size: 12px;
  border-radius: 999px;
  background: rgba(99,102,241,.15);
  color: #c7d2fe;
}
`;

  return (<>
    <style> {appStyles} </style>
    <div className="appShell">
      <Sidebar
        workspaces={workspaces}
        activeWorkspaceId={activeWorkspaceId}
        onSelectWorkspace={openWorkspace}
        onCreateWorkspace={handleCreateWorkspace}
        pages={pages}
        activePageId={activePageId}
        onSelectPage={(pid) => openPage(activeWorkspaceId, pid)}
        onCreatePage={handleCreatePage}
        onOpenWorkspaceSettings={() => setSettingsOpen(true)}
      />

      <main className="main">
        {loading ? <div className="tag">loading...</div> : null}
        {error ? (
          <div className="errorBox">
            <div className="errorText">{error.message}</div>
          </div>
        ) : null}

        <Editor
          key={activePageId || "no-page"}
          page={pageQuery.data?.page || null}
          blocks={blocks}
          onRenamePage={handleRenamePage}
          onCreateParagraph={handleCreateParagraph}
          onUpdateBlock={handleUpdateBlock}
          onDeleteBlock={handleDeleteBlock}
        />

        <WorkspaceSettings
          open={settingsOpen}
          onClose={() => setSettingsOpen(false)}
          workspace={workspace}
          me={me}
          onAddMember={handleAddMember}
          onUpdateRole={handleUpdateRole}
          onRemoveMember={handleRemoveMember}
          onTransferOwnership={handleTransferOwnership}
        />
      </main>
    </div>
  
  </>
  );
}
