import { useState } from "react";
import "../styles/ReportPipelineListing.css";

const STAGES = [
  { key: "authoring",     label: "Authoring",     color: "#3b82f6" },
  { key: "editing",       label: "Editing",        color: "#8b5cf6" },
  { key: "compliance",    label: "Compliance",     color: "#f59e0b" },
  { key: "publishing",    label: "Publishing",     color: "#10b981" },
  { key: "distributing",  label: "Distributing",   color: "#06b6d4" },
];

const TEMPLATES = [
  { id: "company",   label: "Company Report",   icon: "📈", desc: "Company Report" },
  { id: "sector",   label: "Sector Report",   icon: "🏭", desc: "Sector Report" },
  { id: "ipo",   label: "IPO",   icon: "🏦", desc: "IPO distribution report" },
  { id: "strategy",      label: "Strategy Report",        icon: "🌿", desc: "Strategy report" },
  { id: "economy",    label: "Economy Report",    icon: "🌐", desc: "Economic report" },
  { id: "indiadaily",    label: "India Daily",    icon: "📄", desc: "India Daily" },
  { id: "blank",    label: "Blank Document",    icon: "📄", desc: "Start from scratch with a clean template" },
];

const SAMPLE_REPORTS = [
  { id: 1, name: "Q4 2024 Performance Report",     company: "Acme Corporation",    type: "Equity Research",  stage: "editing",      analyst: "Priya Sharma",   date: "Mar 2025",  status: { color: "#10b981", label: "Buy"  } },
  { id: 2, name: "FY2025 Credit Risk Assessment",   company: "BlueStar Capital",    type: "Credit Analysis",  stage: "compliance",   analyst: "James Caldwell", date: "Feb 2025",  status: { color: "#ef4444", label: "Hold" } },
  { id: 3, name: "Technology Sector Overview",      company: "Global Ventures",     type: "Sector Overview",  stage: "authoring",    analyst: "Aisha Okonkwo",  date: "Mar 2025",  status: { color: "#f59e0b", label: "Add"  } },
  { id: 4, name: "ESG Compliance Report 2024",      company: "Evergreen Group",     type: "ESG Report",       stage: "publishing",   analyst: "Priya Sharma",   date: "Jan 2025",  status: { color: "#3b82f6", label: "Initiate" } },
  { id: 5, name: "APAC Macro Outlook Q1 2025",      company: "Horizon Capital",     type: "Macro Research",   stage: "distributing", analyst: "James Caldwell", date: "Mar 2025",  status: { color: "#10b981", label: "Upgrade" } },
  { id: 6, name: "Consumer Discretionary Analysis", company: "Apex Holdings",       type: "Sector Overview",  stage: "authoring",    analyst: "Aisha Okonkwo",  date: "Mar 2025",  status: { color: "#f97316", label: "Reduce" } },
  { id: 7, name: "Fixed Income Portfolio Review",   company: "Crestview Partners",  type: "Credit Analysis",  stage: "editing",      analyst: "Priya Sharma",   date: "Feb 2025",  status: { color: "#ef4444", label: "Sell"  } },
];

export default function ReportListing({ onOpenReport }) {
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [hoveredTemplate, setHoveredTemplate]     = useState(null);
  const [search, setSearch]                       = useState("");
  const [filterStage, setFilterStage]             = useState("all");

  const filtered = SAMPLE_REPORTS.filter((r) => {
    const matchSearch = r.name.toLowerCase().includes(search.toLowerCase()) ||
                        r.company.toLowerCase().includes(search.toLowerCase());
    const matchStage  = filterStage === "all" || r.stage === filterStage;
    return matchSearch && matchStage;
  });

  const handleTemplateSelect = (template) => {
    setShowTemplateModal(false);
    onOpenReport(template);
  };

  return (
    <div className="rl-shell">

      {/* ── Top navigation bar ── */}
      <div className="rl-nav">
        <div className="rl-nav-brand">
          <span className="rl-nav-logo">📄</span>
          <span className="rl-nav-title">ReportEditor</span>
          <span className="rl-nav-sep">|</span>
          <span className="rl-nav-sub">Research Management</span>
        </div>
        <div className="rl-nav-right">
          <span className="rl-nav-user">Priya Sharma</span>
          <div className="rl-nav-avatar">PS</div>
        </div>
      </div>

      {/* ── Page header ── */}
      <div className="rl-page-header">
        <div className="rl-page-header-left">
          <h1 className="rl-page-title">Reports</h1>
          <span className="rl-page-count">{SAMPLE_REPORTS.length} reports</span>
        </div>
        <button className="rl-create-btn" onClick={() => setShowTemplateModal(true)}>
          <span className="rl-create-icon">＋</span>
          Create Report
        </button>
      </div>

      {/* ── Filters ── */}
      <div className="rl-filters">
        <div className="rl-search-wrap">
          <span className="rl-search-icon">🔍</span>
          <input
            className="rl-search"
            placeholder="Search reports or companies…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="rl-stage-filters">
          <button
            className={`rl-stage-filter ${filterStage === "all" ? "active" : ""}`}
            onClick={() => setFilterStage("all")}
          >All</button>
          {STAGES.map((s) => (
            <button
              key={s.key}
              className={`rl-stage-filter ${filterStage === s.key ? "active" : ""}`}
              style={{ "--stage-color": s.color }}
              onClick={() => setFilterStage(s.key)}
            >{s.label}</button>
          ))}
        </div>
      </div>

      {/* ── Pipeline table ── */}
      <div className="rl-table-wrap">
        <table className="rl-table">
          <thead>
            <tr>
              <th className="rl-th rl-th-report">Report</th>
              {STAGES.map((s) => (
                <th key={s.key} className="rl-th rl-th-stage">
                  <span className="rl-th-dot" style={{ background: s.color }} />
                  {s.label}
                </th>
              ))}
              <th className="rl-th">Analyst</th>
              <th className="rl-th">Date</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((report, i) => {
              const stageIdx  = STAGES.findIndex((s) => s.key === report.stage);
              return (
                <tr
                  key={report.id}
                  className="rl-tr"
                  style={{ animationDelay: `${i * 40}ms` }}
                  onClick={() => onOpenReport({ id: report.id, report })}
                >
                  {/* Report name + meta */}
                  <td className="rl-td rl-td-report">
                    <div className="rl-report-name">{report.name}</div>
                    <div className="rl-report-meta">
                      <span className="rl-report-company">{report.company}</span>
                      <span className="rl-report-type">{report.type}</span>
                    </div>
                  </td>

                  {/* Stage pipeline cards */}
                  {STAGES.map((s, si) => {
                    const isActive  = s.key === report.stage;
                    const isDone    = si < stageIdx;
                    const isPending = si > stageIdx;
                    return (
                      <td key={s.key} className="rl-td rl-td-stage">
                        <div className={`rl-stage-card ${isActive ? "active" : ""} ${isDone ? "done" : ""} ${isPending ? "pending" : ""}`}
                          style={{ "--c": s.color }}>
                          {isDone    && <span className="rl-stage-check">✓</span>}
                          {isActive  && <span className="rl-stage-label">{s.label}</span>}
                          {isPending && <span className="rl-stage-dot-empty" />}
                        </div>
                      </td>
                    );
                  })}

                  <td className="rl-td">
                    <div className="rl-analyst">
                      <div className="rl-analyst-av">
                        {report.analyst.split(" ").map((n) => n[0]).join("").slice(0,2)}
                      </div>
                      <span className="rl-analyst-name">{report.analyst.split(" ")[0]}</span>
                    </div>
                  </td>
                  <td className="rl-td rl-td-date">{report.date}</td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <div className="rl-empty">
            <span className="rl-empty-icon">📭</span>
            <p>No reports match your search.</p>
          </div>
        )}
      </div>

      {/* ── Template selection modal ── */}
      {showTemplateModal && (
        <div className="rl-modal-backdrop" onClick={() => setShowTemplateModal(false)}>
          <div className="rl-modal" onClick={(e) => e.stopPropagation()}>
            <div className="rl-modal-header">
              <div>
                <div className="rl-modal-title">Choose a Template</div>
                <div className="rl-modal-sub">Select a template to begin your report</div>
              </div>
              <button className="rl-modal-close" onClick={() => setShowTemplateModal(false)}>✕</button>
            </div>
            <div className="rl-template-grid">
              {TEMPLATES.map((t) => (
                <button
                  key={t.id}
                  className={`rl-template-card ${hoveredTemplate === t.id ? "hovered" : ""}`}
                  onMouseEnter={() => setHoveredTemplate(t.id)}
                  onMouseLeave={() => setHoveredTemplate(null)}
                  onClick={() => handleTemplateSelect(t)}
                >
                  <span className="rl-template-icon">{t.icon}</span>
                  <span className="rl-template-label">{t.label}</span>
                  <span className="rl-template-desc">{t.desc}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
