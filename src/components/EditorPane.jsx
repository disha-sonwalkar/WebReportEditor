import { useEffect, useRef, useState } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import {
  DecoupledEditor, Essentials, Paragraph, Bold, Italic, Underline,
  Strikethrough, Heading, FontSize, FontFamily, FontColor,
  FontBackgroundColor, Alignment, List, ListProperties, Indent, IndentBlock,
  Link, AutoLink, Table, TableToolbar, TableProperties, TableCellProperties,
  TableCaption, HorizontalLine, BlockQuote, Undo, PageBreak, CloudServices,
  FindAndReplace, SpecialCharacters, SpecialCharactersEssentials,
  Subscript, Superscript, RemoveFormat, SelectAll,
  Image, ImageToolbar, ImageCaption, ImageStyle, ImageResize, ImageUpload,
  Highlight,
} from "ckeditor5";
import { Pagination, ExportPdf, ExportWord } from "ckeditor5-premium-features";
import TableOfContent from "./TableOfContent";
import "../styles/EditorPane.css";

const LICENSE_KEY  = import.meta.env.VITE_CK_LICENSE_KEY;
const TOKEN_URL    = import.meta.env.VITE_CK_TOKEN_URL;
const PAGE_MARGINS = { top: "20mm", bottom: "20mm", left: "25mm", right: "25mm" };

export default function EditorPane({ initialContent, onChange, onReady, showTOC, content }) {
  const toolbarRef = useRef(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => { setIsMounted(true); return () => setIsMounted(false); }, []);

  const handleReady = (editor) => {
    if (toolbarRef.current) {
      toolbarRef.current.appendChild(editor.ui.view.toolbar.element);
    }
    editor.keystrokes.set("Ctrl+Enter", (_data, cancel) => {
      editor.execute("pageBreak");
      cancel();
    });
    onReady?.(editor);
  };

  const handleDestroy = () => {
    if (toolbarRef.current) {
      while (toolbarRef.current.firstChild)
        toolbarRef.current.removeChild(toolbarRef.current.firstChild);
    }
  };

  return (
    <div className="editor-pane-inner">
      {/* Toolbar spans full width */}
      <div className="toolbar-container" ref={toolbarRef} />

      {/* Row: TOC sidebar + page canvas */}
      <div className="editor-content-row">
        <TableOfContent content={content} isOpen={showTOC} />

        <div className="page-scroll">
          {isMounted && (
            <CKEditor
              editor={DecoupledEditor}
              data={initialContent}
              config={{
                licenseKey: LICENSE_KEY,
                plugins: [
                  Essentials, Paragraph,
                  Bold, Italic, Underline, Strikethrough,
                  Subscript, Superscript, Highlight, RemoveFormat,
                  Heading, BlockQuote, HorizontalLine, PageBreak,
                  FontSize, FontFamily, FontColor, FontBackgroundColor,
                  Alignment, List, ListProperties, Indent, IndentBlock,
                  Link, AutoLink,
                  Table, TableToolbar, TableProperties,
                  TableCellProperties, TableCaption,
                  Image, ImageToolbar, ImageCaption, ImageStyle,
                  ImageResize, ImageUpload,
                  FindAndReplace, SpecialCharacters,
                  SpecialCharactersEssentials, SelectAll, Undo,
                  CloudServices, Pagination, ExportPdf, ExportWord,
                ],
                toolbar: {
                  items: [
                    "exportPdf", "exportWord", "|",
                    "previousPage", "nextPage", "pageNavigation", "|",
                    "undo", "redo", "|",
                    "findAndReplace", "|",
                    "heading", "|",
                    "fontFamily", "fontSize", "|",
                    "fontColor", "fontBackgroundColor", "|",
                    "bold", "italic", "underline", "strikethrough",
                    "subscript", "superscript", "highlight", "|",
                    "removeFormat", "|",
                    "alignment", "|",
                    "bulletedList", "numberedList", "outdent", "indent", "|",
                    "blockQuote", "insertTable", "horizontalLine",
                    "link", "uploadImage",
                    "specialCharacters", "|",
                    "selectAll", "pageBreak",
                  ],
                  shouldNotGroupWhenFull: false,
                },
                pagination: {
                  pageWidth: "21cm",
                  pageHeight: "29.7cm",
                  pageMargins: PAGE_MARGINS,
                },
                cloudServices: { tokenUrl: TOKEN_URL },
                exportPdf: {
                  fileName: "report-q4-2024.pdf",
                  stylesheets: ["./ckeditor5.css", "./ckeditor5-premium-features.css", "./style.css"],
                  converterOptions: {
                    format: "A4",
                    margin_top: "20mm", margin_bottom: "20mm",
                    margin_left: "25mm", margin_right: "25mm",
                    page_orientation: "portrait",
                  },
                },
                exportWord: {
                  fileName: "report-q4-2024.docx",
                  stylesheets: ["./ckeditor5.css", "./ckeditor5-premium-features.css", "./style.css"],
                  converterOptions: {
                    document: {
                      size: "A4",
                      margins: { top: "20mm", bottom: "20mm", left: "25mm", right: "25mm" },
                    },
                  },
                },
                heading: {
                  options: [
                    { model: "paragraph", title: "Paragraph",  class: "ck-heading_paragraph" },
                    { model: "heading1",  view: "h1", title: "Heading 1", class: "ck-heading_heading1" },
                    { model: "heading2",  view: "h2", title: "Heading 2", class: "ck-heading_heading2" },
                    { model: "heading3",  view: "h3", title: "Heading 3", class: "ck-heading_heading3" },
                    { model: "heading4",  view: "h4", title: "Heading 4", class: "ck-heading_heading4" },
                  ],
                },
                table: {
                  contentToolbar: [
                    "tableColumn", "tableRow", "mergeTableCells",
                    "tableProperties", "tableCellProperties", "toggleTableCaption",
                  ],
                },
                image: {
                  toolbar: [
                    "imageTextAlternative", "toggleImageCaption", "|",
                    "imageStyle:inline", "imageStyle:block", "imageStyle:side", "|",
                    "resizeImage",
                  ],
                },
                fontSize: { options: [8, 9, 10, 11, 12, 14, 16, 18, 20, 24, 28, 32] },
                list: { properties: { styles: true, startIndex: true, reversed: true } },
              }}
              onReady={handleReady}
              onAfterDestroy={handleDestroy}
              onChange={(_e, editor) => onChange?.(editor.getData())}
            />
          )}
        </div>
      </div>
    </div>
  );
}
