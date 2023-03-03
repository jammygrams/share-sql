## Share-sql

### Instructions
1. Start server: `PORT=4444 node ./bin/server.js`. [Reference](https://github.com/yjs/y-webrtc#signaling) (using public yjs servers is very erratic)
2. `npm run dev`
3. Open up `localhost:3000` in two browsers!

### TODO
* user model
    * anon log in by default, creates new room name
    * click to get room name / url to share
* big: backup document in firestore 
    * switch to next js repo
    * editor.js editor sends update to server on doc update
    * server recieves updates in map per doc ID
    * every 5 seconds server writes array of updates to firestore, and clears stored updates
    * when you connect to a room from frontend, 
        * keep local index db as well? and load from here first?
        * try to load from firestore?
* display default query
* understand styling / features with codemirror2
    * user name display better
* is highlighting tables a worthwhile feature? how to work?
* select query to generate summary?
* multiple pages per room, on left hand side tab?

## LOW
* understand web socket failure?
* understand how ref would work here vs state? (low)