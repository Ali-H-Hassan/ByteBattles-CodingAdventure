import React from "react";
import MonacoEditor from "react-monaco-editor";
import "./CodingEditor.css";

const CodingEditor = ({ code, handleCodeChange }) => {
  const editorDidMount = (editor) => {
    editor.focus();
  };

  const onChange = (newValue, e) => {
    handleCodeChange(newValue);
  };

  const options = {
    selectOnLineNumbers: true,
    roundedSelection: false,
    readOnly: false,
    cursorStyle: "line",
    automaticLayout: true,
  };

  return (
    <MonacoEditor
      height="400"
      language="javascript"
      theme="vs-dark"
      value={code}
      options={options}
      onChange={onChange}
      editorDidMount={editorDidMount}
    />
  );
};

export default CodingEditor;
