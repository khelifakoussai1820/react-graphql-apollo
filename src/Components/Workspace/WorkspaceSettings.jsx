import { useMemo, useState } from "react";

export default function WorkspaceSettings({
  open,
  onClose,
  workspace,
  me,
  onAddMember,
  onUpdateRole,
  onRemoveMember,
  onTransferOwnership,
}) {
  const [userId, setUserId] = useState("");
  const [role, setRole] = useState("MEMBER");

  const { myRole, canManage, canTransfer } = useMemo(() => {
    const ownerId = workspace?.OwnerID || "";
    const meId = me?.id || "";
    const members = workspace?.Members || [];
    let r = "";
    if (meId && ownerId && meId === ownerId) r = "OWNER";
    if (!r) {
      const m = members.find((x) => String(x.userId) === String(meId));
      r = m?.role || "";
    }
    return {
      myRole: r || "MEMBER",
      canManage: r === "OWNER" || r === "ADMIN",
      canTransfer: r === "OWNER",
    };
  }, [workspace, me]);

  if (!open) return null;

  const members = workspace?.Members || [];
  const ownerId = workspace?.OwnerID || "";
  const meId = me?.id || "";

  const submitAdd = async () => {
    if (!workspace?.id || !userId.trim()) return;
    await onAddMember?.(workspace.id, userId.trim(), role);
    setUserId("");
    setRole("MEMBER");
  };

  const submitTransfer = async (newOwnerUserId) => {
    if (!workspace?.id) return;
    if (!confirm("Transfer ownership? This cannot be undone.")) return;
    await onTransferOwnership?.(workspace.id, newOwnerUserId);
  };

  /* =======================
            Styles
  ======================== */
  const styles = {
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.35)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 50,
  },

  modal: {
    width: "100%",
    maxWidth: "720px",
    background: "#ffffff",
    borderRadius: "16px",
    padding: "24px",
    boxShadow: "0 25px 60px rgba(0,0,0,0.25)",
    fontFamily: "Inter, system-ui, sans-serif",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "24px",
  },

  title: {
    fontSize: "20px",
    fontWeight: 600,
    color: "#0f172a",
  },

  tag: {
    marginTop: "6px",
    fontSize: "12px",
    color: "#475569",
    background: "#f1f5f9",
    padding: "4px 10px",
    borderRadius: "999px",
    width: "fit-content",
  },

  card: {
    background: "#f8fafc",
    borderRadius: "14px",
    padding: "16px",
    marginBottom: "16px",
  },

  row: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px 0",
    borderBottom: "1px solid #e5e7eb",
  },

  input: {
    padding: "8px 12px",
    borderRadius: "10px",
    border: "1px solid #d1d5db",
    fontSize: "14px",
    background: "#ffffff",
    outline: "none",
  },

  btnPrimary: {
    padding: "10px 14px",
    borderRadius: "10px",
    background: "#2563eb",
    color: "#ffffff",
    border: "none",
    fontWeight: 600,
    cursor: "pointer",
    transition: "background .2s ease",
  },

  btnSecondary: {
    padding: "8px 12px",
    borderRadius: "10px",
    background: "#000000",
    border: "1px solid #e5e7eb",
    fontWeight: 500,
    cursor: "pointer",
    transition: "background .2s ease",
  },

  actions: {
    display: "flex",
    gap: "8px",
    alignItems: "center",
  },
};


  return (
    <div style={styles.overlay} onMouseDown={onClose}>
      <div style={styles.modal} onMouseDown={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={styles.header}>
          <div>
            <div style={styles.title}>Workspace settings</div>
            <div style={styles.tag}>
              {workspace?.name} · your role: {myRole.toLowerCase()}
            </div>
          </div>
          <button style={styles.btnSecondary} onClick={onClose}>Close</button>
        </div>

        {/* Members */}
        <div style={styles.card}>
          <strong>Members ({members.length})</strong>

          {members.map((m) => {
            const isOwner = String(m.userId) === String(ownerId);
            const isMe = String(m.userId) === String(meId);
            const canEdit = canManage && !isOwner;

            return (
              <div key={m.id} style={styles.row}>
                <div>
                  <div>
                    {m.user?.name || m.user?.email || m.userId}
                    {isMe && <span style={{ marginLeft: 6, ...styles.tag }}>you</span>}
                    {isOwner && <span style={{ marginLeft: 6, ...styles.tag }}>owner</span>}
                  </div>
                  <div style={{ fontSize: 12, color: "#64748b" }}>
                    {m.user?.email || m.userId}
                  </div>
                </div>

                <div style={styles.actions}>
                  <select
                    style={styles.input}
                    disabled={!canEdit}
                    value={m.role}
                    onChange={(e) =>
                      onUpdateRole?.(workspace.id, m.userId, e.target.value)
                    }
                  >
                    <option value="ADMIN">ADMIN</option>
                    <option value="MEMBER">MEMBER</option>
                  </select>

                  {canEdit && (
                    <button
                      style={styles.btnSecondary}
                      onClick={() => onRemoveMember?.(workspace.id, m.userId)}
                    >
                      remove
                    </button>
                  )}

                  {canTransfer && !isOwner && (
                    <button
                      style={styles.btnSecondary}
                      onClick={() => submitTransfer(m.userId)}
                    >
                      make owner
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Add member */}
        <div style={styles.card}>
          <strong>Add member</strong>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginTop: "10px" }}>
            <input
              style={styles.input}
              placeholder="userId"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              disabled={!canManage}
            />
            <select
              style={styles.input}
              value={role}
              onChange={(e) => setRole(e.target.value)}
              disabled={!canManage}
            >
              <option value="MEMBER">MEMBER</option>
              <option value="ADMIN">ADMIN</option>
            </select>
          </div>

          <button
            style={{ ...styles.btnPrimary, marginTop: 10, opacity: canManage ? 1 : 0.5 }}
            disabled={!canManage}
            onClick={submitAdd}
          >
            add
          </button>

          {!canManage && (
            <div style={{ marginTop: 8, fontSize: 12, color: "#64748b" }}>
              only owner/admin can manage members
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
