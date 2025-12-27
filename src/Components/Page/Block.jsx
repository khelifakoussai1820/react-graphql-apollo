import { useMemo, useState } from "react";

function getText(data) {
  if (!data) return "";
  if (typeof data === "string") return data;
  if (typeof data === "object" && data.text != null) return String(data.text);
  try {
    return JSON.stringify(data);
  } catch {
    return "";
  }
}

export default function Block({ block, onUpdate, onDelete }) {
  const initial = useMemo(() => getText(block.data), [block.data]);
  const [value, setValue] = useState(initial);

  const typeLabel = (block.Type || "PARAGRAPH").toLowerCase();

  return (
    <div className="card" style={{ background: "var(--panel-2)" }}>
      <div className="split">
        <div className="tag">{typeLabel}</div>
        <div className="toolbar">
          <button className="btn btnSecondary" type="button" onClick={() => onDelete(block.id)}>
            delete
          </button>
        </div>
      </div>

      <textarea
        className="editorBlock"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={() => onUpdate(block.id, block.Type, { text: value })}
        rows={2}
      />
    </div>
  );
}
