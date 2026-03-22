import { useEffect, useRef, useState } from "react";
import "../styles/PreviewPane.css";

const PAGE_W    = 794;
const PAGE_H    = 1123;
const PAGE_GAP  = 16;   // visible grey gap between pages
const PAD_TOP   = 75;   // A4 top/bottom margin
const PAD_SIDE  = 94;   // A4 left/right margin
const CONTENT_H = PAGE_H - PAD_TOP - PAD_TOP;  // 973px usable per page

function PreviewFooter({ analysts }) {
  if (!analysts.length) return null;
  return (
    <div className="pv-footer">
      <div className="pv-footer-inner">
        <div className="pv-footer-label">Research Coverage</div>
        <div className="pv-footer-analysts">
          {analysts.map((a) => (
            <div key={a.id} className="pv-footer-analyst">
              <div className="pv-footer-avatar">
                {a.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
              </div>
              <div className="pv-footer-info">
                <span className="pv-footer-name">{a.name}</span>
                <span className="pv-footer-title">{a.title}</span>
                {a.email && <span className="pv-footer-contact">{a.email}</span>}
                {a.phone && <span className="pv-footer-contact">{a.phone}</span>}
              </div>
            </div>
          ))}
        </div>
        <p className="pv-footer-disclaimer">
          This report is prepared for informational purposes only. The information
          herein is believed to be reliable but has not been independently verified.
          Past performance is not indicative of future results.
        </p>
      </div>
    </div>
  );
}

/*
 * Split html into exactly `count` chunks by measuring rendered heights
 * in a hidden div matching the A4 content width (606px).
 */
function splitIntoPages(html, count) {
  if (!html || count <= 0) return [html];

  const wrapper = document.createElement("div");
  wrapper.style.cssText = `
    position:absolute; visibility:hidden; pointer-events:none;
    width:${PAGE_W - PAD_SIDE * 2}px;
    font-family:Calibri,"Segoe UI",Arial,sans-serif;
    font-size:10.5pt; line-height:1.6;
    top:-9999px; left:-9999px;
  `;
  wrapper.innerHTML = html;
  document.body.appendChild(wrapper);

  const children = Array.from(wrapper.children);
  const totalH   = wrapper.scrollHeight;
  const targetH  = totalH / count;

  const pages       = [];
  let currentNodes  = [], currentH = 0, pagesFilled = 0;

  for (const node of children) {
    const h         = node.offsetHeight || 0;
    const remaining = count - pagesFilled;
    if (currentH + h > targetH && currentNodes.length > 0 && remaining > 1) {
      pages.push(currentNodes.map((n) => n.outerHTML).join(""));
      currentNodes = []; currentH = 0; pagesFilled++;
    }
    currentNodes.push(node);
    currentH += h;
  }
  if (currentNodes.length > 0)
    pages.push(currentNodes.map((n) => n.outerHTML).join(""));

  document.body.removeChild(wrapper);
  while (pages.length < count) pages.push("");
  return pages.length > 0 ? pages : [html];
}

export default function PreviewPane({
  content,
  pageCount,
  analystPool = [],
  selectedAnalysts = [],
}) {
  const count     = Math.max(1, pageCount || 1);
  const scrollRef = useRef(null);
  const [scale, setScale] = useState(1);

  const analysts = analystPool.filter((a) => selectedAnalysts.includes(a.id));
  const pages    = splitIntoPages(content, count);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const update = () => {
      const available = el.clientWidth - 32; // 16px padding each side
      setScale(available >= PAGE_W ? 1 : Math.max(0.5, available / PAGE_W));
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div className="preview-panel">
      <div className="preview-panel-header">
        <span>👁 Live Preview</span>
        <span className="preview-panel-pagecount">
          {count} {count === 1 ? "page" : "pages"}
        </span>
      </div>

      <div className="preview-scroll" ref={scrollRef}>
        {pages.map((pageHtml, i) => {
          const isLast = i === pages.length - 1;
          // Compensate for transform scale collapsing layout space
          const scaledH     = PAGE_H * scale;
          const marginBottom = scale < 1 ? -(PAGE_H - scaledH) + PAGE_GAP : PAGE_GAP;
          const marginRight  = scale < 1 ? -(PAGE_W - PAGE_W * scale) : 0;

          return (
            <div
              key={i}
              className="preview-page"
              style={{
                transform:       scale < 1 ? `scale(${scale})` : undefined,
                transformOrigin: "top left",
                marginBottom:    isLast ? (scale < 1 ? -(PAGE_H - scaledH) + PAGE_GAP : PAGE_GAP) : marginBottom,
                marginRight:     scale < 1 ? marginRight : 0,
              }}
            >
              <div className="preview-page-number">
                Page {i + 1} of {count}
              </div>

              <div
                className="preview-readable"
                dangerouslySetInnerHTML={{ __html: pageHtml }}
              />

              {/* Footer on last page */}
              {isLast && analysts.length > 0 && (
                <PreviewFooter analysts={analysts} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
