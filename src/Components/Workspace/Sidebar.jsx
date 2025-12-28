import useAuth from "../../hooks/useAuth";

export default function Sidebar({
  workspaces,
  activeWorkspaceId,
  onSelectWorkspace,
  onCreateWorkspace,
  pages,
  activePageId,
  onSelectPage,
  onCreatePage,
  onOpenWorkspaceSettings,
}) {
  const { logout } = useAuth();

  return (
    <aside className="sidebar">
      <div className="split">
        <div>
          <div className="tag">mini-notion</div>
          <div className="tag">/graphql</div>
        </div>
        <button className="btn btnSecondary" onClick={logout} type="button">logout</button>
      </div>

      <div className="card">
        <div className="split">
          <div>workspaces</div>
          <div style={{ display: "flex", gap: "var(--s-1)" }}>
            <button className="btn btnSecondary" onClick={onCreateWorkspace} type="button" style={{ width: "auto" }}>
              + ws
            </button>
            <button
              className="btn btnSecondary"
              onClick={onOpenWorkspaceSettings}
              type="button"
              style={{ width: "auto" }}
              disabled={!activeWorkspaceId}
              title={activeWorkspaceId ? "Manage members & roles" : "Select a workspace first"}
            >
              settings
            </button>
          </div>
        </div>
        <div className="list" style={{ marginTop: "var(--s-2)" }}>
          {(workspaces || []).map((ws) => (
            <div
              key={ws.id}
              className={`listItem ${ws.id === activeWorkspaceId ? "listItemActive" : ""}`}
              onClick={() => onSelectWorkspace(ws.id)}
              role="button"
              tabIndex={0}
            >
              <span>{ws.name || "untitled"}</span>
              {ws.id === activeWorkspaceId ? <span className="tag">active</span> : null}
            </div>
          ))}
          {!workspaces?.length ? <div className="tag">no workspace yet</div> : null}
        </div>
      </div>

      <div className="card">
        <div className="split">
          <div>pages</div>
          <button
            className="btn btnSecondary"
            onClick={onCreatePage}
            type="button"
            disabled={!activeWorkspaceId}
          >
            + page
          </button>
        </div>
        <div className="list" style={{ marginTop: "var(--s-2)" }}>
          {(pages || []).map((p) => (
            <div
              key={p.id}
              className={`listItem ${p.id === activePageId ? "listItemActive" : ""}`}
              onClick={() => onSelectPage(p.id)}
              role="button"
              tabIndex={0}
            >
              <span>{p.title || "untitled"}</span>
              {p.archived ? <span className="tag">archived</span> : null}
            </div>
          ))}
          {activeWorkspaceId && !pages?.length ? <div className="tag">no pages yet</div> : null}
          {!activeWorkspaceId ? <div className="tag">select a workspace</div> : null}
        </div>
      </div>
    </aside>
  );
}
