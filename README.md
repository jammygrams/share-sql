# Share SQL

## Todo
**major features**
* Data persists in firestore (done)
    * anonymous firestore login in _app.js (done)
    * when login, create doc for the user, with user id (done)
    * for user, if no code data, create tutorial post (done)
    * load user posts and display them (done)
    * move state up to _app.js (which runs on top of index), and turn into context so easier to access everywhere (done)
        * still unclear if better as props or context?
    * all accordions need to write document state by index. (done)
    * save button. (done)
* Change save to debounce on typing (done)
* how to test?
* Come up with design v2
    * just have preview of sql viewable in each box at start? all slightly open?
* teams / multiplayer

**Smaller tasks**
* share??
* display tables used in query in summary
* fix summary text after edit e.g. https://codesandbox.io/s/editable-field-material-ui-t1sq4?file=/src/index.tsx https://codesandbox.io/s/pjyx2wq3mm?file=/src/EditableTextField.js 
* understand this about memoisation: https://dmitripavlutin.com/react-throttle-debounce/
* format user input sql into proper sql, will be important for gpt (requires thought - existing solution?)
    * don't want to overwrite user preferences on writing? have it be a button?
* convert anonymous login to google login
* remove save button and just have global save indicator, with check mark when save is complete
* if user has already written something, incorporate into generation? (maybe not?)

**other**
* tests?