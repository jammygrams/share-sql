import React, { useEffect, useRef, useState } from "react";
// import { CodemirrorBinding } from "y-codemirror";
import { yCollab as CodemirrorBinding } from "y-codemirror.next";
// import { UnControlled as CodeMirrorEditor } from "react-codemirror2";
// import CodeMirror from "@uiw/react-codemirror";
// import { useCodeMirror } from "@uiw/react-codemirror";
import { UnControlled as CodeMirrorEditor } from "react-codemirror2";
// import { sql } from "@codemirror/lang-sql";
import * as Y from "yjs";
import { WebrtcProvider } from "y-webrtc";
import "./Editor.css";
import RandomColor from "randomcolor";
// import "./EditorAddons.js";

const ROOM_NAME = "test-room-jhamat";
const SIGNAL_ADDRESS = "ws://localhost.com/4444";
// const extensions = [sql()];

export default function Editor() {
  const [EditorRef, setEditorRef] = useState(null);
  const editor = useRef();
  const [code, setCode] = useState("select this from that");
  // const { setContainer } = useCodeMirror({
  //   container: editor.current,
  //   extensions,
  //   value: code,
  // });

  const handleEditorDidMount = (editor) => {
    setEditorRef(editor);
  };

  useEffect(() => {
    if (EditorRef) {
      // setContainer(editor.current);
      const ydoc = new Y.Doc(); //create a ydoc

      let provider = null;
      try {
        provider = new WebrtcProvider(ROOM_NAME, ydoc, {
          signaling: [SIGNAL_ADDRESS],
        });
    
        const yText = ydoc.getText("codemirror");
        const yUndoManager = new Y.UndoManager(yText);
        const awareness = provider.awareness;
        const color = RandomColor();
    
        awareness.setLocalStateField("user", {
          name: "Users Name",
          color: color,
        });
    
        const getBinding = new CodemirrorBinding(
          yText,
          EditorRef,
          awareness,
          {
            yUndoManager,
          }
        );
      } catch (err) {
        alert("error in collaborating try refreshing or come back later !");
      }

      // return () => {

      //   if (provider) {
      //     provider.disconnect(); //We destroy doc we created and disconnect
      //     ydoc.destroy();  //the provider to stop propagting changes if user leaves editor
      //   }
      // };
    }
  }, [EditorRef]);

  return (
    <div
      style={{
        display: "flex",
        height: "100%",
        width: "100%",
        fontSize: "20px",
        overflowY: "auto",
      }}
    >
    <CodeMirrorEditor
        onChange={(editor, data, value) => {
          setCode(value);
        }}
    autoScroll
    options={{
      mode: "text/x-c++src", // https://github.com/atharmohammad/Code-N-Collab/blob/master/src/Function/languageMapper.js
      theme: "monokai",
      lineWrapping: true,
      smartIndent: true,
      lineNumbers: true,
      foldGutter: true,
      tabSize: 2,
      gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
      autoCloseTags: true,
      matchBrackets: true,
      autoCloseBrackets: true,
      extraKeys: {
        "Ctrl-Space": "autocomplete",
      },
    }}
    editorDidMount={(editor) => {
      handleEditorDidMount(editor);
      editor.setSize("100vw", "100%");
    }}
    />
    </div>
  );
}
