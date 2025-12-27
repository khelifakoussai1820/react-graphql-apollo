import { useEffect, useMemo } from "react";
import { useMutation, useQuery } from "@apollo/client";

import Sidebar from "../../Components/Workspace/Sidebar";
import Editor from "../../Components/Page/Editor";

import useWorkspace from "../../hooks/useWorkspace";

import { WORKSPACES } from "../../graphql/queries/workspace";
import { PAGES, PAGE } from "../../graphql/queries/page";
import { BLOCKS } from "../../graphql/queries/block";

import { CREATE_WORKSPACE } from "../../graphql/mutations/workspace";
import { CREATE_PAGE, UPDATE_PAGE } from "../../graphql/mutations/page";
import { CREATE_BLOCK, UPDATE_BLOCK, DELETE_BLOCK_TREE } from "../../graphql/mutations/block";

export default function WorkspacePage() {
  const { workspaceId, pageId, openWorkspace, openPage } = useWorkspace();

  const wsQuery = useQuery(WORKSPACES, { fetchPolicy: "cache-and-network" });
  const workspaces = wsQuery.data?.workspaces || [];

  const activeWorkspaceId = useMemo(() => {
    if (workspaceId) return workspaceId;
    return workspaces[0]?.id || "";
  }, [workspaceId, workspaces]);

  const pagesQuery = useQuery(PAGES, {
    variables: activeWorkspaceId ? { workspaceId: activeWorkspaceId } : undefined,
    skip: !activeWorkspaceId,
    fetchPolicy: "cache-and-network",
  });
  const pages = pagesQuery.data?.pages || [];

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
    refetchQueries: activeWorkspaceId ? [{ query: PAGES, variables: { workspaceId: activeWorkspaceId } }] : [],
  });
  const [updatePage] = useMutation(UPDATE_PAGE);

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

  const loading = wsQuery.loading || (activeWorkspaceId && pagesQuery.loading);
  const error = wsQuery.error || pagesQuery.error || pageQuery.error || blocksQuery.error;

  return (
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
      />

      <main className="main">
        {loading ? <div className="tag">loading...</div> : null}
        {error ? (
          <div className="errorBox">
            <div className="errorText">{error.message}</div>
          </div>
        ) : null}

        <Editor
          page={pageQuery.data?.page || null}
          blocks={blocks}
          onRenamePage={handleRenamePage}
          onCreateParagraph={handleCreateParagraph}
          onUpdateBlock={handleUpdateBlock}
          onDeleteBlock={handleDeleteBlock}
        />
      </main>
    </div>
  );
}
