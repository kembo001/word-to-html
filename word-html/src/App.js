import React, { useState, useRef, useEffect } from "react";
import Prism from "prismjs";
import './App.css';
import "prismjs/themes/prism.css"; // Import Prism.js CSS theme
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { cleanHTML } from "./utils";



function App() {
  const [content, setContent] = useState("");
  const editorRef = useRef(null);
  const previewRef = useRef(null); // Reference for the HTML preview

  // Function to handle text formatting
  const formatText = (command) => {
    document.execCommand(command, false, null); // Executes formatting commands
    editorRef.current.focus(); // Refocus the editor after formatting
  };

  // gere
  

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


      <div className="editor-preview-container">
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
            whiteSpace: "pre-wrap", // Ensures the code wraps properly
            wordWrap: "break-word", // Ensures long words wrap
          }}
        >
          <code className="language-html">{content}</code>
        </pre>
      </div>   </div>

      {/* Footer */}
      <footer className="app-footer">
        <p>&copy; 2024 Triton WordHTML </p>
      </footer>
    </div>
  );
}

export default App;
