import React, { useEffect, useRef, useState } from "react";
import { CodemirrorBinding } from "y-codemirror";
import { UnControlled as CodeMirrorEditor } from "react-codemirror2";
import * as Y from "yjs";
import { WebrtcProvider } from "y-webrtc";
import { IndexeddbPersistence } from 'y-indexeddb'
import "./Editor.css";
import RandomColor from "randomcolor";
import "./EditorAddons";

const ROOM_NAME = "test-room-jhamat-new";

export function Editor(props) {
  
  const [EditorRef, setEditorRef] = useState(null);
  const [code, setCode] = useState("");
  
  const handleEditorDidMount = (editor) => {
    // waiting for editor to load before setting reference
    editor.setSize("100vw", "100vh");
    setEditorRef(editor);
  };

  useEffect(() => {
    
    if (EditorRef) { // i.e. editor exists
      const ydoc = new Y.Doc();

      let provider = null;
      try {
        provider = new WebrtcProvider(ROOM_NAME , ydoc, {
          signaling: [
            "wss://signaling.yjs.dev",
            'wss://y-webrtc-signaling-eu.herokuapp.com', 
            'wss://y-webrtc-signaling-us.herokuapp.com'
          ]
        });
        let index_provider = new IndexeddbPersistence(ROOM_NAME, ydoc)
        const yText = ydoc.getText("codemirror");
        const yUndoManager = new Y.UndoManager(yText);
        const awareness = provider.awareness; //awareness is what makes other user aware about your actions 
        const color = RandomColor(); //Provied any random color to be used for each user
        
        awareness.setLocalStateField("user", {
          name: "Users Name",
          color: color,
        });
        
        const getBinding = new CodemirrorBinding(yText, EditorRef, awareness, {
          yUndoManager,
        });
        
      } catch (err) {
        alert("error in collaborating try refreshing or come back later !");
      }
      return () => {
        // if useEffect returns a function, it is cleanup: runs on unmount
        if (provider) {
          provider.disconnect(); //We destroy doc we created and disconnect 
          ydoc.destroy();  //the provider to stop propagting changes if user leaves editor
        }
      };
    }
  }, [EditorRef]);

  return (
    // <div
    //   style={{
    //     display: "flex",
    //     height: "100%",
    //     width: "100%",
    //     fontSize: "20px",
    //     overflowY: "auto",
    //   }}
    // >
    <>
      <CodeMirrorEditor
        onChange={(editor, data, value) => {
          setCode(value);
          // console.log(code)
        }}
        autoScroll
        options={{
          mode: "text/x-sql",
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
        }}
      />
    </>
    // </div>
  );
}