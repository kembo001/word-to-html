import React, { useState, useRef, useEffect } from "react";
import Prism from "prismjs";
import DOMPurify from "dompurify";
import "prismjs/themes/prism.css"; // Import Prism.js CSS theme

function App() {
  const [content, setContent] = useState("");
  const editorRef = useRef(null);
  const previewRef = useRef(null); // Reference for the HTML preview

  // Function to handle text formatting
  const formatText = (command) => {
    document.execCommand(command, false, null); // Executes formatting commands
    editorRef.current.focus(); // Refocus the editor after formatting
  };

  // Normalize and clean HTML content
  const cleanHTML = (html) => {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;

    // Remove unnecessary span tags
    Array.from(tempDiv.querySelectorAll("span")).forEach((span) => {
      if (!span.attributes.length) {
        span.replaceWith(span.innerHTML); // Replace <span> with its innerHTML
      }
    });

    // Remove aria-level attributes
    Array.from(tempDiv.querySelectorAll("[aria-level]")).forEach((node) => {
      node.removeAttribute("aria-level");
    });

    // Remove unnecessary br tags
    Array.from(tempDiv.querySelectorAll("br")).forEach((br) => {
      br.remove(); // Completely remove <br> tags
    });

    // Use DOMPurify to sanitize the cleaned HTML
    return DOMPurify.sanitize(tempDiv.innerHTML, {
      ALLOWED_TAGS: ["h1", "h2", "h3", "h4", "h5", "h6", "p", "ul", "ol", "li", "a", "b", "i", "u", "strong", "em"],
      ALLOWED_ATTR: ["href"],
    });
  };

  // Handle input in the editor
  const handleInput = (e) => {
    const rawHtml = e.currentTarget.innerHTML;
    const cleanedHtml = cleanHTML(rawHtml); // Clean the HTML
    setContent(cleanedHtml);
  };

  // Handle Copy to Clipboard
  const handleCopy = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(content).then(() => {
        alert("HTML code copied to clipboard!");
      });
    } else {
      alert("Clipboard API not supported in your browser.");
    }
  };

  // Enable Ctrl+A to select the HTML preview
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.key === "a") {
        e.preventDefault();
        const selection = window.getSelection();
        const range = document.createRange();
        range.selectNodeContents(previewRef.current);
        selection.removeAllRanges();
        selection.addRange(range);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Re-highlight syntax whenever content updates
  useEffect(() => {
    Prism.highlightAll();
  }, [content]);

  return (
    <div className="app-container">
      {/* Header */}
      <header className="app-header">
        <h1>Enhanced WordHTML Editor</h1>
      </header>

      {/* Toolbar */}
      <div className="toolbar">
        <button onClick={() => formatText("bold")}>Bold</button>
        <button onClick={() => formatText("italic")}>Italic</button>
        <button onClick={() => formatText("underline")}>Underline</button>
        <button onClick={() => formatText("insertUnorderedList")}>
          Bullet List
        </button>
        <button onClick={() => formatText("insertOrderedList")}>
          Number List
        </button>
        <button
          onClick={() => {
            const url = prompt("Enter URL:");
            if (url) formatText("createLink", url);
          }}
        >
          Add Link
        </button>
      </div>

      {/* Editor */}
      <div
        ref={editorRef}
        className="wysiwyg-editor"
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        style={{
          border: "1px solid #ccc",
          padding: "10px",
          minHeight: "200px",
          marginTop: "10px",
        }}
      ></div>

      {/* HTML Code Preview with Syntax Highlighting */}
      <div className="html-preview">
        <h2>HTML Code Preview</h2>
        <button onClick={handleCopy} style={{ marginBottom: "10px" }}>
          Copy HTML
        </button>
        <pre
          className="language-html"
          ref={previewRef}
          style={{
            border: "1px solid #ccc",
            padding: "10px",
            minHeight: "200px",
            backgroundColor: "#f9f9f9",
            marginTop: "10px",
            whiteSpace: "pre-wrap", // Ensures the code wraps properly
            wordWrap: "break-word", // Ensures long words wrap
          }}
        >
          <code className="language-html">{content}</code>
        </pre>
      </div>

      {/* Footer */}
      <footer className="app-footer">
        <p>&copy; 2024 WordHTML Clone by Adrian</p>
      </footer>
    </div>
  );
}

export default App;
