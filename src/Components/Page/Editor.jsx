import { useEffect, useMemo, useState } from "react";
import Block from "./Block";

export default function Editor({
  page,
  blocks,
  onRenamePage,
  onCreateParagraph,
  onUpdateBlock,
  onDeleteBlock,
}) {
  const [title, setTitle] = useState(page?.title || "");

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTitle(page?.title || "");
  }, [page?.id]);

  const safeBlocks = useMemo(() => blocks || [], [blocks]);

  if (!page) {
    return (
      <div className="card">
        <div className="tag">select a page on the left</div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--s-3)" }}>
      <div className="card">
        <div className="split">
          <div className="tag">page</div>
          <button className="btn btnSecondary" type="button" onClick={onCreateParagraph}>
            + paragraph
          </button>
        </div>

        <input
          className="editorTitle"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={() => onRenamePage(page.id, title)}
          placeholder="Untitled"
        />
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "var(--s-3)" }}>
        {safeBlocks.map((b) => (
          <Block key={b.id} block={b} onUpdate={onUpdateBlock} onDelete={onDeleteBlock} />
        ))}
        {!safeBlocks.length ? <div className="tag">no blocks yet</div> : null}
      </div>
    </div>
  );
}
