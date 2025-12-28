import useAuth from "../../hooks/useAuth";

/* =======================
          Styles
======================= */
const styles = {
  sidebar: {
    width: "260px",
    background: "#ffffff",
    borderRight: "1px solid #e5e7eb",
    padding: "16px",
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    fontFamily: "Inter, system-ui, sans-serif",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  brand: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },

  tag: {
    fontSize: "12px",
    padding: "4px 8px",
    background: "#f1f5f9",
    borderRadius: "6px",
    color: "#475569",
    width: "fit-content",
  },

  card: {
    background: "#f8fafc",
    borderRadius: "12px",
    padding: "12px",
  },

  split: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontSize: "14px",
    fontWeight: 600,
    color: "#334155",
  },

  list: {
    marginTop: "10px",
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },

  listItem: {
    padding: "8px 10px",
    borderRadius: "8px",
    cursor: "pointer",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontSize: "14px",
    color: "#334155",
  },

  listItemActive: {
    background: "#eef2ff",
    color: "#4338ca",
    fontWeight: 600,
  },

  btnSecondary: {
    padding: "6px 10px",
    borderRadius: "8px",
    border: "1px solid #e5e7eb",
    background: "#ffffff",
    fontSize: "12px",
    cursor: "pointer",
    fontWeight: 600,
  },
};

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
    <aside style={styles.sidebar}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.brand}>
          <div style={styles.tag}>mini-notion</div>
          <div style={styles.tag}>/graphql</div>
        </div>
        <button style={styles.btnSecondary} onClick={logout} type="button">
          logout
        </button>
      </div>

      {/* Workspaces */}
      <div style={styles.card}>
        <div style={styles.split}>
          <div>workspaces</div>
          <div style={{ display: "flex", gap: "6px" }}>
            <button style={styles.btnSecondary} onClick={onCreateWorkspace} type="button">
              + ws
            </button>
            <button
              style={styles.btnSecondary}
              onClick={onOpenWorkspaceSettings}
              type="button"
              disabled={!activeWorkspaceId}
              title={activeWorkspaceId ? "Manage members & roles" : "Select a workspace first"}
            >
              settings
            </button>
          </div>
        </div>

        <div style={styles.list}>
          {(workspaces || []).map((ws) => (
            <div
              key={ws.id}
              onClick={() => onSelectWorkspace(ws.id)}
              role="button"
              tabIndex={0}
              style={{
                ...styles.listItem,
                ...(ws.id === activeWorkspaceId ? styles.listItemActive : {}),
              }}
            >
              <span>{ws.name || "untitled"}</span>
              {ws.id === activeWorkspaceId && <span style={styles.tag}>active</span>}
            </div>
          ))}

          {!workspaces?.length && <div style={styles.tag}>no workspace yet</div>}
        </div>
      </div>

      {/* Pages */}
      <div style={styles.card}>
        <div style={styles.split}>
          <div>pages</div>
          <button
            style={styles.btnSecondary}
            onClick={onCreatePage}
            type="button"
            disabled={!activeWorkspaceId}
          >
            + page
          </button>
        </div>

        <div style={styles.list}>
          {(pages || []).map((p) => (
            <div
              key={p.id}
              onClick={() => onSelectPage(p.id)}
              role="button"
              tabIndex={0}
              style={{
                ...styles.listItem,
                ...(p.id === activePageId ? styles.listItemActive : {}),
              }}
            >
              <span>{p.title || "untitled"}</span>
              {p.archived && <span style={styles.tag}>archived</span>}
            </div>
          ))}

          {activeWorkspaceId && !pages?.length && <div style={styles.tag}>no pages yet</div>}
          {!activeWorkspaceId && <div style={styles.tag}>select a workspace</div>}
        </div>
      </div>
    </aside>
  );
}
