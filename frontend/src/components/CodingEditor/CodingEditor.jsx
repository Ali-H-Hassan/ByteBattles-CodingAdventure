import React from "react";
import MonacoEditor from "react-monaco-editor";
import "./CodingEditor.css";

const CodingEditor = ({ code, handleCodeChange, readOnly = false }) => {
  const editorDidMount = (editor) => {
    if (!readOnly) {
      editor.focus();
    }
  };

  const onChange = (newValue, e) => {
    if (!readOnly && handleCodeChange) {
      handleCodeChange(newValue);
    }
  };

  const options = {
    selectOnLineNumbers: true,
    roundedSelection: false,
    readOnly: readOnly,
    cursorStyle: "line",
    automaticLayout: true,
    fontSize: 18,
  };

  return (
    <div className="coding-editor-container">
      <MonacoEditor
        height="100%"
        language="javascript"
        theme="vs-dark"
        value={code}
        options={options}
        onChange={onChange}
        editorDidMount={editorDidMount}
      />
    </div>
  );
};

export default CodingEditor;
