import { useRef, useState, useCallback } from "react";
import "ckeditor5/ckeditor5.css";
import "ckeditor5-premium-features/ckeditor5-premium-features.css";

import "./styles/global.css";
import TopBar          from "./components/TopBar";
import EditorPane      from "./components/EditorPane";
import PreviewPane     from "./components/PreviewPane";
import DragDivider     from "./components/DragDivider";
import AIPanel         from "./components/AIPanel";
import ReportConfig    from "./components/ReportConfig";

const INITIAL_CONTENT = `
<h1>Q4 2024 Performance Report</h1>
<h2>Acme Corporation</h2>
<p><strong>Prepared by:</strong> Priya Sharma &nbsp;|&nbsp; <strong>Date:</strong> March 2025 &nbsp;|&nbsp; <strong>Rating:</strong> BBB+</p>
<hr>

<h3>Executive Summary</h3>
<p>
  Total revenue for Q4 stands at <strong>$4.2M</strong>, reflecting a <strong>12.4%</strong>
  year-over-year growth against a target of <strong>$3.8M</strong>.
  Assets under management stand at <strong>$142M</strong> as of reporting date.
</p>

<h3>Financial Performance</h3>
<p>The table below summarises quarterly performance across key financial metrics.</p>

<table>
  <tbody>
    <tr>
      <th>Metric</th><th>Q3 2024</th><th>Q4 2024</th><th>Target</th><th>Variance</th>
    </tr>
    <tr><td>Revenue</td><td>$3.8M</td><td>$4.2M</td><td>$3.8M</td><td>+10.5%</td></tr>
    <tr><td>Operating Costs</td><td>$2.1M</td><td>$2.3M</td><td>$2.2M</td><td>+4.5%</td></tr>
    <tr><td>Net Profit</td><td>$1.7M</td><td>$1.9M</td><td>$1.6M</td><td>+18.7%</td></tr>
    <tr><td>AUM</td><td>$128M</td><td>$142M</td><td>$135M</td><td>+5.2%</td></tr>
  </tbody>
</table>

<h3>Risk Analysis</h3>
<p>
  The portfolio maintains a risk rating of <strong>BBB+</strong> with diversified
  exposure across asset classes. Equity allocation remains the largest component
  at 35% of total AUM, followed by Fixed Income at 28%.
</p>

<h3>Outlook</h3>
<p>
  Management projects continued growth of <strong>12.4%</strong> into FY2025,
  subject to macro conditions and ongoing regulatory review. The pipeline
  includes three new institutional mandates currently in due diligence.
</p>
`;

export default function App() {
  const containerRef = useRef(null);
  const saveTimer    = useRef(null);

  const [content,        setContent]        = useState(INITIAL_CONTENT);
  const [pageCount,      setPageCount]      = useState(1);
  const [saveStatus,     setSaveStatus]     = useState("saved");
  const [showTOC,        setShowTOC]        = useState(false);
  const [showPreview,    setShowPreview]    = useState(false);
  const [showAI,         setShowAI]         = useState(false);
  const [showConfig,     setShowConfig]     = useState(false);
  const [reportConfig,   setReportConfig]   = useState({ reportType: "", sector: "", company: "Acme Corporation", status: "Draft" });
  const [editorWidthPct, setEditorWidthPct] = useState(60);

  const handleDrag = useCallback((clientX) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const pct  = ((clientX - rect.left) / rect.width) * 100;
    setEditorWidthPct(Math.min(75, Math.max(50, pct)));
  }, []);

  const handleChange = (data) => {
    setContent(data);
    setSaveStatus("unsaved");
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      setSaveStatus("saving");
      setTimeout(() => setSaveStatus("saved"), 700);
    }, 1500);
  };

  const handleEditorReady = (editor) => {
    try {
      const pagination = editor.plugins.get("Pagination");
      setPageCount(pagination.pageCount);
      editor.model.document.on("change", () => setPageCount(pagination.pageCount));
    } catch (e) {
      console.warn("Pagination not available:", e.message);
    }
  };

  return (
    <div className="app-shell">

      <TopBar
        pageCount={pageCount}
        saveStatus={saveStatus}
        showTOC={showTOC}         onToggleTOC={() => setShowTOC((p) => !p)}
        showPreview={showPreview} onTogglePreview={() => setShowPreview((p) => !p)}
        showAI={showAI}           onToggleAI={() => setShowAI((p) => !p)}
        showConfig={showConfig}   onToggleConfig={() => setShowConfig((p) => !p)}
      />

      <div ref={containerRef} className="app-body">

        <div
          className="editor-pane"
          style={{ width: showPreview ? `${editorWidthPct}%` : "100%" }}
        >
          <EditorPane
            initialContent={INITIAL_CONTENT}
            onChange={handleChange}
            onReady={handleEditorReady}
            showTOC={showTOC}
            content={content}
          />
        </div>

        {showPreview && <DragDivider onDrag={handleDrag} />}

        {showPreview && (
          <div
            className="preview-pane"
            style={{ width: `${100 - editorWidthPct}%` }}
          >
            <PreviewPane content={content} pageCount={pageCount} />
          </div>
        )}

      </div>

<AIPanel isOpen={showAI} onClose={() => setShowAI(false)} />

      <ReportConfig
        isOpen={showConfig}
        onClose={() => setShowConfig(false)}
        config={reportConfig}
        onChange={setReportConfig}
      />

    </div>
  );
}
