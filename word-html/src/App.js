import React, { useState } from "react";

function App() {
  // State to manage the content of the editor
  const [content, setContent] = useState("");

  // Function to handle input changes
  const handleContentChange = (event) => {
    setContent(event.target.value);
  };

  return (
    <div className="app-container">
      {/* Header */}
      <header className="app-header">
        <h1>WordHTML Clone</h1>
      </header>

      {/* Editor Section */}
      <main className="editor-container">
        {/* WYSIWYG Editor */}
        <section className="wysiwyg-editor">
          <h2>Editor</h2>
          <textarea
            id="editor"
            className="editor-textarea"
            placeholder="Start typing here..."
            value={content}
            onChange={handleContentChange}
          ></textarea>
        </section>

        {/* HTML Preview */}
        <section className="html-preview">
          <h2>HTML Preview</h2>
          <div
            id="preview"
            className="preview-output"
            dangerouslySetInnerHTML={{ __html: content }}
          ></div>
        </section>
      </main>

      {/* Footer */}
      <footer className="app-footer">
        <p>&copy; 2024 Triton Word to HTML</p>
      </footer>
    </div>
  );
}

export default App;
