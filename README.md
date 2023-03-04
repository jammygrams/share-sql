## Share-sql

### Instructions
1. Copy [project firebase config](https://console.firebase.google.com/project/share-sql/settings/general/web:N2Y3NTgyMzUtZmNkNi00MzE1LWFhYjUtZjFjNzQ2MDEwMTUy) into `./firebase.config.js`
1. Start WebRTC signalling server: `PORT=4444 node ./bin/server.js`.
    * [Reference](https://github.com/yjs/y-webrtc#signaling)
    * using public yjs servers is very erratic
1. Run `npm run dev`
1. Open up `localhost:3000` in two browsers!

### TODO
* Get baseline working on Next.js (done)
* Anon log in creates new room per user, and username. (done)
* Users can access same room by url (done)
* Fix caret for user awareness.
* Display default query
* big: backup document in firestore 
    * editor.js editor sends update to webrtc / websocket server on doc update
    * server recieves updates in map per doc ID
    * every 5 seconds server writes array of updates to firestore, and clears stored updates
    * when you connect to a room from frontend, 
        * keep local index db as well? and load from here first?
        * try to load from firestore?
* Improve styling / features with codemirror2
* Is highlighting tables used a worthwhile feature? how to work?
* Select query to generate summary with GPT?
* Multiple pages per room, on left hand side tab?

### Low priority
* understand web socket failure?
    * Answer: Was yjs servers being shit. switching to self hosted server works.
* understand how useRef works vs. useState for editorRef?
* clean up firebase config in git history
