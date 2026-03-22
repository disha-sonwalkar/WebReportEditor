import { useEffect, useMemo, useRef, useState } from "react";
import "../styles/TableOfContent.css";

const LEVEL_MAP = { h1: 1, h2: 2, h3: 3, h4: 4 };

function parseHeadings(html) {
  if (!html) return [];
  const div = document.createElement("div");
  div.innerHTML = html;
  return Array.from(div.querySelectorAll("h1, h2, h3, h4"))
    .map((el, i) => ({
      id:    `toc-${i}`,
      level: LEVEL_MAP[el.tagName.toLowerCase()] ?? 2,
      text:  el.textContent.trim(),
    }))
    .filter((h) => h.text.length > 0);
}

function scrollEditorToHeading(text) {
  const editable = document.querySelector(".ck-editor__editable");
  if (!editable) return;
  for (const el of editable.querySelectorAll("h1,h2,h3,h4,h5,h6")) {
    if (el.textContent.trim() === text) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      break;
    }
  }
}

function scrollToFooter() {
  const footer = document.querySelector(".doc-footer");
  if (footer) {
    footer.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

export default function TableOfContent({ content, isOpen, analysts = [] }) {
  const [activeId, setActiveId] = useState(null);
  const headings = useMemo(() => parseHeadings(content), [content]);

  // Highlight active heading based on scroll position
  useEffect(() => {
    if (!isOpen) return;
    const editable    = document.querySelector(".ck-editor__editable");
    const scrollParent = editable?.closest(".page-scroll") || editable?.parentElement;
    if (!scrollParent) return;

    const onScroll = () => {
      if (!editable) return;
      let current = null;
      for (const el of editable.querySelectorAll("h1,h2,h3,h4")) {
        if (el.getBoundingClientRect().top <= 120) current = el.textContent.trim();
        else break;
      }
      if (current) setActiveId(current);
    };

    scrollParent.addEventListener("scroll", onScroll, { passive: true });
    return () => scrollParent.removeEventListener("scroll", onScroll);
  }, [isOpen]);

  return (
    <aside className={`toc-sidebar ${isOpen ? "open" : ""}`}>
      {/* Header */}
      <div className="toc-header">
        <span className="toc-header-icon">≡</span>
        <span className="toc-header-title">Contents</span>
      </div>

      {/* Navigation */}
      <nav className="toc-nav">
        {headings.length === 0 ? (
          <div className="toc-empty">
            <span className="toc-empty-icon">≡</span>
            <p>No headings yet.</p>
            <p className="toc-empty-sub">Add H1–H4 headings to build an outline.</p>
          </div>
        ) : (
          <ul className="toc-list">
            {headings.map((h) => (
              <li
                key={h.id}
                className={`toc-item toc-level-${h.level} ${activeId === h.text ? "active" : ""}`}
              >
                <button
                  className="toc-link"
                  onClick={() => { setActiveId(h.text); scrollEditorToHeading(h.text); }}
                  title={h.text}
                >
                  <span className="toc-link-indicator" />
                  <span className="toc-link-text">{h.text}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </nav>

      {/* ── Research Coverage section ── */}
      {analysts.length > 0 && (
        <div className="toc-section">
          <div className="toc-section-label">Research Coverage</div>
          {analysts.map((a) => (
            <button
              key={a.id}
              className={`toc-link toc-analyst-link ${activeId === `analyst-${a.id}` ? "active-analyst" : ""}`}
              onClick={() => { setActiveId(`analyst-${a.id}`); scrollToFooter(); }}
              title={`${a.name} — ${a.title}`}
            >
              <span className="toc-analyst-avatar">
                {a.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
              </span>
              <span className="toc-link-text">
                <span className="toc-analyst-name">{a.name}</span>
                <span className="toc-analyst-title">{a.title}</span>
              </span>
            </button>
          ))}
        </div>
      )}

      {headings.length > 0 && (
        <div className="toc-footer">
          {headings.length} heading{headings.length !== 1 ? "s" : ""}
        </div>
      )}
    </aside>
  );
}
