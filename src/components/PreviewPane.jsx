import { useEffect, useRef, useState } from "react";
import "../styles/PreviewPane.css";

const PAGE_WIDTH    = 794;
const PAGE_HEIGHT_PX = 1123;

function splitIntoPages(html, targetPageCount = 1) {
  const wrapper = document.createElement("div");
  wrapper.style.cssText = `
    position: absolute; visibility: hidden; pointer-events: none;
    width: 606px;
    font-family: Calibri, "Segoe UI", Arial, sans-serif;
    font-size: 10.5pt; line-height: 1.6;
  `;
  wrapper.innerHTML = html;
  document.body.appendChild(wrapper);

  const children = Array.from(wrapper.children);
  const totalH   = wrapper.scrollHeight;
  const targetH  = totalH / Math.max(1, targetPageCount);
  const pages    = [];
  let currentNodes = [], currentH = 0, pagesFilled = 0;

  for (const node of children) {
    const h         = node.offsetHeight || 0;
    const remaining = targetPageCount - pagesFilled;
    if (currentH + h > targetH && currentNodes.length > 0 && remaining > 1) {
      pages.push(currentNodes.map((n) => n.outerHTML).join(""));
      currentNodes = []; currentH = 0; pagesFilled++;
    }
    currentNodes.push(node);
    currentH += h;
  }
  if (currentNodes.length > 0) pages.push(currentNodes.map((n) => n.outerHTML).join(""));
  document.body.removeChild(wrapper);
  while (pages.length < targetPageCount) pages.push("");
  return pages.length > 0 ? pages : [html];
}

function ScaledPage({ html, index, total, scale }) {
  const pageRef            = useRef(null);
  const [marginBottom, setMarginBottom] = useState(0);
  const [marginRight,  setMarginRight]  = useState(0);

  useEffect(() => {
    const el = pageRef.current;
    if (!el) return;

    const compute = () => {
      if (scale >= 1) {
        setMarginBottom(0);
        setMarginRight(0);
        return;
      }
      const h = el.offsetHeight;
      const w = el.offsetWidth;
      // After scale(), layout still occupies full h×w.
      // We need layout to occupy (h*scale + PAGE_GAP) tall and (w*scale) wide.
      // PAGE_GAP = 8px comes from margin-top on .preview-page in CSS.
      setMarginBottom(-(h - h * scale) + 8);
      setMarginRight(-(w - w * scale));
    };

    compute();

    // Re-compute whenever content causes the page height to change
    const ro = new ResizeObserver(compute);
    ro.observe(el);
    return () => ro.disconnect();
  }, [scale, html]);

  return (
    <div
      ref={pageRef}
      className="preview-page"
      style={{
        transform:       scale < 1 ? `scale(${scale})` : undefined,
        transformOrigin: "top left",
        marginRight,
        marginBottom,
      }}
    >
      <div className="preview-page-number">Page {index + 1} of {total}</div>
      <div className="preview-readable" dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
}

export default function PreviewPane({ content, pageCount }) {
  const count     = Math.max(1, pageCount || 1);
  const pages     = splitIntoPages(content, count);
  const scrollRef = useRef(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const update = () => {
      const available = el.clientWidth - 16;
      setScale(available >= PAGE_WIDTH ? 1 : Math.max(0.65, available / PAGE_WIDTH));
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
        {pages.map((pageHtml, i) => (
          <ScaledPage key={i} html={pageHtml} index={i} total={count} scale={scale} />
        ))}
      </div>
    </div>
  );
}
