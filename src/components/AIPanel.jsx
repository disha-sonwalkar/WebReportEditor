import { createPortal } from "react-dom";
import "../styles/AIPanel.css";

export default function AIPanel({ isOpen, onClose }) {
  return createPortal(
    <div className={`ai-panel-overlay ${isOpen ? "open" : ""}`}>
      <div className="ai-panel">
        <div className="ai-panel-header">
          <div className="ai-panel-title">
            <span className="ai-panel-icon">✦</span>
            AI Features
          </div>
          <button className="ai-panel-close" onClick={onClose} title="Close">
            ✕
          </button>
        </div>
        <div className="ai-panel-body">
          <div className="ai-panel-coming-soon">
            <span className="ai-coming-soon-icon">✦</span>
            <p className="ai-coming-soon-title">AI Assistant</p>
            <p className="ai-coming-soon-sub">
              Chat, summarise, rewrite, and more — coming soon.
            </p>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
