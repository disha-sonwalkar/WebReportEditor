import { useState } from "react";
import { createPortal } from "react-dom";
import "../styles/ReportConfig.css";

const REPORT_TYPES = [
  "Equity Research",
  "Credit Analysis",
  "Sector Overview",
  "ESG Report",
  "M&A Analysis",
  "Fixed Income",
  "Macro Research",
  "Portfolio Review",
];

const SECTORS = [
  "Technology",
  "Healthcare",
  "Financials",
  "Consumer Discretionary",
  "Consumer Staples",
  "Energy",
  "Industrials",
  "Materials",
  "Real Estate",
  "Utilities",
  "Communication Services",
];

const STATUSES = [
  "Draft",
  "In Review",
  "Approved",
  "Published",
  "Archived",
];

export default function ReportConfig({ isOpen, onClose, config, onChange }) {
  const handleField = (field, value) => {
    onChange({ ...config, [field]: value });
  };

  return createPortal(
    <div className={`rc-overlay ${isOpen ? "open" : ""}`}>
      <div className="rc-panel">

        {/* Header */}
        <div className="rc-header">
          <div className="rc-header-title">
            <span className="rc-header-icon">⚙</span>
            Report Configuration
          </div>
          <button className="rc-close" onClick={onClose} title="Close">✕</button>
        </div>

        {/* Body */}
        <div className="rc-body">

          {/* Report Type */}
          <div className="rc-field">
            <label className="rc-label">Report Type</label>
            <div className="rc-chip-group">
              {REPORT_TYPES.map((type) => (
                <button
                  key={type}
                  className={`rc-chip ${config.reportType === type ? "selected" : ""}`}
                  onClick={() => handleField("reportType", type)}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div className="rc-divider" />

          {/* Sector */}
          <div className="rc-field">
            <label className="rc-label">Sector</label>
            <div className="rc-chip-group">
              {SECTORS.map((sector) => (
                <button
                  key={sector}
                  className={`rc-chip ${config.sector === sector ? "selected" : ""}`}
                  onClick={() => handleField("sector", sector)}
                >
                  {sector}
                </button>
              ))}
            </div>
          </div>

          <div className="rc-divider" />

          {/* Company */}
          <div className="rc-field">
            <label className="rc-label">Company</label>
            <input
              className="rc-input"
              type="text"
              placeholder="e.g. Acme Corporation"
              value={config.company || ""}
              onChange={(e) => handleField("company", e.target.value)}
            />
          </div>

          <div className="rc-divider" />

          {/* Status */}
          <div className="rc-field">
            <label className="rc-label">Status</label>
            <div className="rc-status-group">
              {STATUSES.map((status) => (
                <button
                  key={status}
                  className={`rc-status-btn rc-status-${status.toLowerCase().replace(/\s+/g, "-")} ${config.status === status ? "selected" : ""}`}
                  onClick={() => handleField("status", status)}
                >
                  <span className="rc-status-dot" />
                  {status}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="rc-footer">
          <button className="rc-btn-reset" onClick={() => onChange({ reportType: "", sector: "", company: "", status: "" })}>
            Reset
          </button>
          <button className="rc-btn-apply" onClick={onClose}>
            Apply
          </button>
        </div>

      </div>
    </div>,
    document.body
  );
}
