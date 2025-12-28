import { useMemo, useState } from "react";

/**
 * Minimal workspace settings modal:
 * - View members
 * - Add member (requires userId)
 * - Change role (ADMIN/MEMBER)
 * - Remove member
 * - Transfer ownership (owner only)
 */
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
    const manage = r === "OWNER" || r === "ADMIN";
    const transfer = r === "OWNER";
    return { myRole: r || "MEMBER", canManage: manage, canTransfer: transfer };
  }, [workspace, me]);

  if (!open) return null;

  const members = workspace?.Members || [];
  const ownerId = workspace?.OwnerID || "";
  const meId = me?.id || "";

  const submitAdd = async () => {
    const id = userId.trim();
    if (!workspace?.id || !id) return;
    await onAddMember?.(workspace.id, id, role);
    setUserId("");
    setRole("MEMBER");
  };

  const submitTransfer = async (newOwnerUserId) => {
    if (!workspace?.id || !newOwnerUserId) return;
    const ok = confirm("Transfer ownership? This cannot be undone.");
    if (!ok) return;
    await onTransferOwnership?.(workspace.id, newOwnerUserId);
  };

  return (
    <div className="modalOverlay" onMouseDown={onClose} role="presentation">
      <div className="modal" onMouseDown={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <div className="modalHeader">
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--s-1)" }}>
            <h2 className="modalTitle">Workspace settings</h2>
            <div className="tag">
              {workspace?.name || "untitled"} · your role: {myRole.toLowerCase()}
            </div>
          </div>
          <button className="btn btnSecondary" type="button" onClick={onClose} style={{ width: "auto" }}>
            close
          </button>
        </div>

        <div className="card" style={{ background: "var(--panel-2)" }}>
          <div className="split">
            <div>members</div>
            <div className="pill">{members.length}</div>
          </div>
          <div className="list" style={{ marginTop: "var(--s-2)" }}>
            {members.map((m) => {
              const isOwner = String(m.userId) === String(ownerId);
              const isMe = String(m.userId) === String(meId);
              const canEditThis = canManage && !isOwner; // role change/removal
              return (
                <div key={m.id} className="row">
                  <div style={{ display: "flex", flexDirection: "column", gap: "var(--s-1)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "var(--s-1)" }}>
                      <span>{m.user?.name || m.user?.email || m.userId}</span>
                      {isMe ? <span className="pill">you</span> : null}
                      {isOwner ? <span className="pill">owner</span> : null}
                    </div>
                    <div className="tag">{m.user?.email || m.userId}</div>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "var(--s-1)" }}>
                    <select
                      className="input"
                      style={{ width: "auto" }}
                      disabled={!canEditThis}
                      value={m.role || "MEMBER"}
                      onChange={(e) => onUpdateRole?.(workspace.id, m.userId, e.target.value)}
                      title={canEditThis ? "Change role" : ""}
                    >
                      <option value="ADMIN">ADMIN</option>
                      <option value="MEMBER">MEMBER</option>
                    </select>

                    {canEditThis ? (
                      <button
                        className="btn btnSecondary"
                        type="button"
                        style={{ width: "auto" }}
                        onClick={() => onRemoveMember?.(workspace.id, m.userId)}
                      >
                        remove
                      </button>
                    ) : null}

                    {canTransfer && !isOwner ? (
                      <button
                        className="btn btnSecondary"
                        type="button"
                        style={{ width: "auto" }}
                        onClick={() => submitTransfer(m.userId)}
                      >
                        make owner
                      </button>
                    ) : null}
                  </div>
                </div>
              );
            })}
            {!members.length ? <div className="tag">no members</div> : null}
          </div>
        </div>

        <div className="card" style={{ background: "var(--panel-2)" }}>
          <div className="split">
            <div>add member</div>
            <div className="tag">requires userId</div>
          </div>
          <div className="grid2" style={{ marginTop: "var(--s-2)" }}>
            <input
              className="input"
              placeholder="userId"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              disabled={!canManage}
            />
            <select className="input" value={role} onChange={(e) => setRole(e.target.value)} disabled={!canManage}>
              <option value="MEMBER">MEMBER</option>
              <option value="ADMIN">ADMIN</option>
            </select>
          </div>
          <button
            className={`btn ${canManage ? "btnPrimary" : "btnSecondary"}`}
            type="button"
            disabled={!canManage}
            onClick={submitAdd}
            style={{ marginTop: "var(--s-2)" }}
          >
            add
          </button>
          {!canManage ? (
            <div className="tag" style={{ marginTop: "var(--s-2)" }}>
              only owner/admin can manage members
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
