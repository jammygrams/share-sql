import React, { useEffect, useRef, useState } from "react";
import { IndexeddbPersistence } from "y-indexeddb";
import "./Editor.module.css";
import RandomColor from "randomcolor";

const ROOM_NAME = "test-room-jhamat";

// Need to load packages in client side only, otherwise get "navigator is not defined" error
//  (anything loaded in `useEffect` call is client side only)
//  `dynamic(import(...), {ssr:false})` also didn't fix the error
//  Importing in this manner is always async, so need to handle promises
async function loadDependencies() {
  const [CodemirrorBinding, WebrtcProvider, UnControlled, Y ] = await Promise.all([
    import("y-codemirror").then((mod) => mod.CodemirrorBinding),
    import("y-webrtc").then((mod) => mod.WebrtcProvider),
    import("react-codemirror2").then((mod) => mod.UnControlled),
    import("yjs") // need to import this on client side else get "Yjs already imported error"
  ]);
  await import("./EditorAddons");
  return {
    CodemirrorBinding,
    WebrtcProvider,
    UnControlled,
    Y
  };
}

export default function Editor(props) {
  const [EditorRef, setEditorRef] = useState(null);
  const [code, setCode] = useState("");
  const [CodeMirrorEditor, setCodeMirror] = useState(Loading);

  const handleEditorDidMount = (editor) => {
    // wait for editor to load before setting reference
    editor.setSize("100vw", "100vh");
    setEditorRef(editor);
  };

  const options = {
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
  };
  
  function Loading() {
    // TODO: change to something more elegant
    return <div>Loading</div>;
  }

  function returnCodeMirror({ UnControlled, options }) {
    return (
      <UnControlled
        onChange={(editor, data, value) => {
          setCode(value);
        }}
        autoScroll
        options={options}
        editorDidMount={(editor) => {
          handleEditorDidMount(editor);
        }}
      ></UnControlled>
    );
  }

  useEffect(() => {
    let provider = null;
    async function initialize() {
      const { CodemirrorBinding, WebrtcProvider, UnControlled, Y } =
        await loadDependencies();
      setCodeMirror(returnCodeMirror({ UnControlled, options }));
      if (EditorRef) {
        // i.e. editor exists
        const ydoc = new Y.Doc();
        try {
          provider = new WebrtcProvider(ROOM_NAME, ydoc, {
            signaling: [
              // These keep failing / very slow to load?
              // "wss://signaling.yjs.dev",
              // "wss://y-webrtc-signaling-eu.herokuapp.com",
              // "wss://y-webrtc-signaling-us.herokuapp.com",
              'ws://localhost:4444'
            ],
          });
          let index_provider = new IndexeddbPersistence(ROOM_NAME, ydoc);
          const yText = ydoc.getText("codemirror");
          const yUndoManager = new Y.UndoManager(yText);
          // awareness makes other user aware about your actions
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
          console.log(err);
        }
      }
    }
    initialize();
    return () => {
      // if useEffect returns a function, it is cleanup: runs on unmount
      if (provider) {
        provider.disconnect(); //We destroy doc we created and disconnect
        ydoc.destroy(); //the provider to stop propagting changes if user leaves editor
      }
    };
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
      {CodeMirrorEditor}
    </div>
  );
}
