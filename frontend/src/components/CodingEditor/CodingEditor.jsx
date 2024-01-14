import React from "react";
import AceEditor from "react-ace";
import ace from "ace-builds/src-noconflict/ace"; // Ensure that ace is imported

import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/theme-github";

// Set the base path if needed
ace.config.set("basePath", process.env.PUBLIC_URL + "/ace");

const CodingEditor = ({ code, handleCodeChange }) => {
  return (
    <AceEditor
      mode="javascript"
      theme="github"
      value={code}
      onChange={handleCodeChange}
      name="UNIQUE_ID_OF_DIV"
      editorProps={{ $blockScrolling: true }}
      setOptions={{
        enableBasicAutocompletion: true,
        enableLiveAutocompletion: true,
        enableSnippets: true,
      }}
    />
  );
};

export default CodingEditor;
