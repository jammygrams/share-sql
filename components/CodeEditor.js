import React from "react";
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-mysql";
import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-noconflict/ext-language_tools";


export default function CodeEditor({ onCodeChange, initialValue }) {
  return (
    <AceEditor
      // placeholder="SELECT id, user, friend FROM table1 JOIN table2"
      mode="mysql"
      theme="monokai"
      // name="blah2"
      //   onLoad={this.onLoad}
      width="100%"
      showPrintMargin={false}
      onChange={onCodeChange}
      fontSize={14}
      showGutter={true}
      highlightActiveLine={true}
      // value={`SELECT id, user, friend FROM table1 JOIN table2`}
      value={initialValue}
      setOptions={{
        enableBasicAutocompletion: false,
        enableLiveAutocompletion: true,
        enableSnippets: false,
        showLineNumbers: true,
        tabSize: 2,
      }}
    />
  );
}
