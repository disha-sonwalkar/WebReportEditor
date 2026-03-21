import { useRef } from "react";
import "../styles/DragDivider.css";

export default function DragDivider({ onDrag }) {
  const dragging = useRef(false);

  const onPointerDown = (e) => {
    dragging.current = true;
    e.currentTarget.setPointerCapture(e.pointerId);
    document.body.style.userSelect = "none";
    document.body.style.cursor = "col-resize";
  };
  const onPointerMove = (e) => {
    if (!dragging.current) return;
    onDrag(e.clientX);
  };
  const onPointerUp = (e) => {
    dragging.current = false;
    e.currentTarget.releasePointerCapture(e.pointerId);
    document.body.style.userSelect = "";
    document.body.style.cursor = "";
  };

  return (
    <div
      className="drag-divider"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onMouseEnter={(e) => (e.currentTarget.style.background = "#1e3a5f")}
      onMouseLeave={(e) => (e.currentTarget.style.background = "#e5e7eb")}
    >
      <div className="drag-divider-dots">
        {[0, 1, 2].map((i) => (
          <div key={i} className="drag-divider-dot" />
        ))}
      </div>
    </div>
  );
}
