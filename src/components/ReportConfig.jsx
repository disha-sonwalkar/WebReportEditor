import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import "../styles/ReportConfig.css";

/* ── Option data ───────────────────────────────────────────────────── */
const REPORT_TYPES = [
  "Equity Research", "Credit Analysis", "Sector Overview", "ESG Report",
  "M&A Analysis", "Fixed Income", "Macro Research", "Portfolio Review",
];

const SECTORS = [
  "Technology", "Healthcare", "Financials", "Consumer Discretionary",
  "Consumer Staples", "Energy", "Industrials", "Materials",
  "Real Estate", "Utilities", "Communication Services",
];

const COMPANIES = [
  "Acme Corporation", "Apex Holdings", "BlueStar Capital", "Crestview Partners",
  "Delta Investments", "Evergreen Group", "Falcon Asset Management",
  "Global Ventures", "Horizon Capital", "Indus Financial",
];

const STATUSES = [
  { value: "Buy",              color: "#10b981" },
  { value: "Sell",             color: "#ef4444" },
  { value: "Hold",             color: "#f59e0b" },
  { value: "Add",              color: "#3b82f6" },
  { value: "Reduce",           color: "#f97316" },
  { value: "Upgrade",          color: "#8b5cf6" },
  { value: "Downgrade",        color: "#ec4899" },
  { value: "Initiate Coverage",color: "#06b6d4" },
  { value: "Change in Reco",   color: "#6b7280" },
  { value: "Under Review",     color: "#9ca3af" },
];

/* ── Reusable dropdown ─────────────────────────────────────────────── */
function Dropdown({ label, value, options, onChange, placeholder = "Select…" }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const selected = options.find((o) => (o.value ?? o) === value);
  const displayLabel = selected
    ? (selected.value ?? selected)
    : <span className="rc-dd-placeholder">{placeholder}</span>;

  return (
    <div className="rc-field">
      <label className="rc-label">{label}</label>
      <div className="rc-dd" ref={ref}>
        <div role="button" tabIndex={0} className={`rc-dd-trigger ${open ? "open" : ""}`} onClick={() => setOpen((p) => !p)} onKeyDown={(e) => e.key === "Enter" && setOpen((p) => !p)}>
          {selected?.color && (
            <span className="rc-dd-dot" style={{ background: selected.color }} />
          )}
          <span className="rc-dd-value">{displayLabel}</span>
          <span className="rc-dd-chevron">▾</span>
        </div>
        {open && (
          <div className="rc-dd-menu">
            {value && (
              <button className="rc-dd-item rc-dd-item--clear" onClick={() => { onChange(""); setOpen(false); }}>
                — Clear selection
              </button>
            )}
            {options.map((opt) => {
              const val   = opt.value ?? opt;
              const color = opt.color;
              return (
                <button
                  key={val}
                  className={`rc-dd-item ${value === val ? "selected" : ""}`}
                  onClick={() => { onChange(val); setOpen(false); }}
                >
                  {color && <span className="rc-dd-dot" style={{ background: color }} />}
                  {val}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Analyst multiselect dropdown ──────────────────────────────────── */
function AnalystMultiselect({ pool, selected, onToggle, onAdd, onEdit, onRemove }) {
  const [open,        setOpen]        = useState(false);
  const [showForm,    setShowForm]    = useState(false);
  const [editingId,   setEditingId]   = useState(null);
  const [draft,       setDraft]       = useState({});
  const [newAnalyst,  setNewAnalyst]  = useState({ name: "", title: "", email: "", phone: "" });
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false); setShowForm(false); setEditingId(null);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const selectedAnalysts = pool.filter((a) => selected.includes(a.id));

  const startEdit = (a) => { setEditingId(a.id); setDraft({ ...a }); setShowForm(false); };
  const saveEdit  = () => { onEdit({ ...draft }); setEditingId(null); };

  const handleAdd = () => {
    if (!newAnalyst.name.trim()) return;
    onAdd({ ...newAnalyst });
    setNewAnalyst({ name: "", title: "", email: "", phone: "" });
    setShowForm(false);
  };

  return (
    <div className="rc-field">
      <label className="rc-label">Analysts <span className="rc-label-hint">— appear in document footer</span></label>
      <div className="rc-dd rc-dd--multi" ref={ref}>

        {/* Trigger */}
        <div role="button" tabIndex={0} className={`rc-dd-trigger ${open ? "open" : ""}`} onClick={() => setOpen((p) => !p)} onKeyDown={(e) => e.key === "Enter" && setOpen((p) => !p)}>
          <span className="rc-dd-value">
            {selectedAnalysts.length === 0
              ? <span className="rc-dd-placeholder">Select analysts…</span>
              : selectedAnalysts.map((a) => (
                  <span key={a.id} className="rc-dd-tag">
                    <span className="rc-dd-tag-avatar">
                      {a.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
                    </span>
                    {a.name}
                    <span className="rc-dd-tag-x" role="button" tabIndex={0} onClick={(e) => { e.stopPropagation(); onToggle(a.id); }} onKeyDown={(e) => e.key === "Enter" && (e.stopPropagation(), onToggle(a.id))}>✕</span>
                  </span>
                ))
            }
          </span>
          <span className="rc-dd-chevron">▾</span>
        </div>

        {/* Menu */}
        {open && (
          <div className="rc-dd-menu rc-dd-menu--wide">
            {/* Pool rows */}
            {pool.map((a) =>
              editingId === a.id ? (
                <div key={a.id} className="rc-analyst-edit-row">
                  <input className="rc-input" placeholder="Name"    value={draft.name}  onChange={(e) => setDraft((d) => ({ ...d, name:  e.target.value }))} />
                  <input className="rc-input" placeholder="Title"   value={draft.title} onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))} />
                  <input className="rc-input" placeholder="Email"   value={draft.email} onChange={(e) => setDraft((d) => ({ ...d, email: e.target.value }))} />
                  <input className="rc-input" placeholder="Phone"   value={draft.phone} onChange={(e) => setDraft((d) => ({ ...d, phone: e.target.value }))} />
                  <div className="rc-analyst-row-actions">
                    <button className="rc-btn rc-btn--save"   onClick={saveEdit}>✓ Save</button>
                    <button className="rc-btn rc-btn--cancel" onClick={() => setEditingId(null)}>Cancel</button>
                  </div>
                </div>
              ) : (
                <div key={a.id} className={`rc-dd-analyst-item ${selected.includes(a.id) ? "selected" : ""}`}>
                  <button className={`rc-check ${selected.includes(a.id) ? "checked" : ""}`} onClick={() => onToggle(a.id)}>
                    {selected.includes(a.id) ? "✓" : ""}
                  </button>
                  <div className="rc-dd-analyst-avatar">
                    {a.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
                  </div>
                  <div className="rc-dd-analyst-info" onClick={() => onToggle(a.id)}>
                    <span className="rc-dd-analyst-name">{a.name}</span>
                    <span className="rc-dd-analyst-sub">{a.title}{a.email ? ` · ${a.email}` : ""}</span>
                  </div>
                  <div className="rc-dd-analyst-btns">
                    <button className="rc-icon-btn" onClick={() => startEdit(a)} title="Edit">✎</button>
                    <button className="rc-icon-btn rc-icon-btn--del" onClick={() => onRemove(a.id)} title="Remove">✕</button>
                  </div>
                </div>
              )
            )}

            {/* Add form */}
            {showForm ? (
              <div className="rc-analyst-edit-row">
                <input className="rc-input" placeholder="Full name *" value={newAnalyst.name}  onChange={(e) => setNewAnalyst((d) => ({ ...d, name:  e.target.value }))} />
                <input className="rc-input" placeholder="Title"       value={newAnalyst.title} onChange={(e) => setNewAnalyst((d) => ({ ...d, title: e.target.value }))} />
                <input className="rc-input" placeholder="Email"       value={newAnalyst.email} onChange={(e) => setNewAnalyst((d) => ({ ...d, email: e.target.value }))} />
                <input className="rc-input" placeholder="Phone"       value={newAnalyst.phone} onChange={(e) => setNewAnalyst((d) => ({ ...d, phone: e.target.value }))} />
                <div className="rc-analyst-row-actions">
                  <button className="rc-btn rc-btn--save"   onClick={handleAdd}>＋ Add</button>
                  <button className="rc-btn rc-btn--cancel" onClick={() => setShowForm(false)}>Cancel</button>
                </div>
              </div>
            ) : (
              <button className="rc-dd-add-btn" onClick={() => { setShowForm(true); setEditingId(null); }}>
                ＋ Add new analyst
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Main component ────────────────────────────────────────────────── */
export default function ReportConfig({ isOpen, onClose, config, onChange }) {
  const pool    = config.analystPool    || [];
  const selected = config.selectedAnalysts || [];

  const handleField = (field, value) => onChange({ ...config, [field]: value });

  const toggleAnalyst = (id) => {
    const next = selected.includes(id) ? selected.filter((x) => x !== id) : [...selected, id];
    handleField("selectedAnalysts", next);
  };

  const addAnalyst = (data) => {
    const id  = Date.now();
    const newPool = [...pool, { ...data, id }];
    onChange({ ...config, analystPool: newPool, selectedAnalysts: [...selected, id] });
  };

  const editAnalyst = (updated) => {
    handleField("analystPool", pool.map((a) => (a.id === updated.id ? updated : a)));
  };

  const removeAnalyst = (id) => {
    onChange({
      ...config,
      analystPool:       pool.filter((a) => a.id !== id),
      selectedAnalysts:  selected.filter((x) => x !== id),
    });
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

        <div className="rc-body">

          <Dropdown
            label="Report Type"
            value={config.reportType || ""}
            options={REPORT_TYPES}
            onChange={(v) => handleField("reportType", v)}
            placeholder="Select report type…"
          />

          <div className="rc-divider" />

          <Dropdown
            label="Sector"
            value={config.sector || ""}
            options={SECTORS}
            onChange={(v) => handleField("sector", v)}
            placeholder="Select sector…"
          />

          <div className="rc-divider" />

          <Dropdown
            label="Company"
            value={config.company || ""}
            options={COMPANIES}
            onChange={(v) => handleField("company", v)}
            placeholder="Select or type company…"
          />

          <div className="rc-divider" />

          <Dropdown
            label="Recommendation / Status"
            value={config.status || ""}
            options={STATUSES}
            onChange={(v) => handleField("status", v)}
            placeholder="Select recommendation…"
          />

          <div className="rc-divider" />

          <AnalystMultiselect
            pool={pool}
            selected={selected}
            onToggle={toggleAnalyst}
            onAdd={addAnalyst}
            onEdit={editAnalyst}
            onRemove={removeAnalyst}
          />

        </div>

        {/* Footer */}
        <div className="rc-footer">
          <button className="rc-btn-reset" onClick={() =>
            onChange({ ...config, reportType: "", sector: "", company: "", status: "", selectedAnalysts: [] })
          }>Reset</button>
          <button className="rc-btn-apply" onClick={onClose}>Apply</button>
        </div>

      </div>
    </div>,
    document.body
  );
}
