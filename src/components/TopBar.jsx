import "../styles/TopBar.css";

export default function TopBar({
  pageCount,
  saveStatus,
  showTOC,
  onToggleTOC,
  showPreview,
  onTogglePreview,
  showAI,
  onToggleAI,
  showConfig,
  onToggleConfig,
}) {
  return (
    <div className="top-bar">
      <button
        onClick={onToggleTOC}
        className={`toc-toggle-btn ${showTOC ? "active" : ""}`}
        title="Table of Contents"
      >
        <span className="toc-btn-icon">≡</span>
        Contents
      </button>

      <div className="top-bar-divider" />

      <span className="top-bar-title">📄 ReportEditor</span>
      <span className="top-bar-doc">Q4 2024 — Acme Corporation</span>

      <span className="top-bar-pagecount">
        {pageCount} {pageCount === 1 ? "page" : "pages"}
      </span>

      <div className="top-bar-actions">
        <button
          onClick={onTogglePreview}
          className={`preview-toggle-btn ${showPreview ? "active" : ""}`}
        >
          {showPreview ? "✕ Hide Preview" : "👁 Show Preview"}
        </button>

        <div className="top-bar-divider" />

        <button
          onClick={onToggleAI}
          className={`ai-toggle-btn ${showAI ? "active" : ""}`}
          title="AI Features"
        >
          <span className="ai-btn-icon">✦</span>
          AI Features
        </button>

        <div className="top-bar-divider" />

        <button
          onClick={onToggleConfig}
          className={`config-toggle-btn ${showConfig ? "active" : ""}`}
          title="Report Configuration"
        >
          <span className="config-btn-icon">⚙</span>
          Report Configuration
        </button>

        <span className={`save-pill ${saveStatus}`}>
          {saveStatus === "saved" && "✓ Saved"}
          {saveStatus === "saving" && "⏳ Saving…"}
          {saveStatus === "unsaved" && "● Unsaved"}
        </span>
      </div>
    </div>
  );
}
