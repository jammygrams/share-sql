# Share SQL

## Todo
**features**
* Data persists in firestore
    * anonymous firestore login in _app.js (done)
    * when login, create doc for the user, with user id (done)
    * for user, if no code data, create tutorial post (done)
    * load user posts and display them (done)
    * move state up to _app.js (which runs on top of index), and turn into context so easier to access everywhere (done)
    * all accordions need to write document state by index. (done)
    * save button. (done)
* Change save to debounce on typing?
* Come up with design v2 - tough, ask kaiden
    * just have preview of sql viewable in each box at start? all slightly open?
* teams
* multiplayer

**lower priority**
* toast for save complete? duplicates above?
* "remove accordion" button and update doc (may be painful again)
* display tables used in query in summary
* format user input sql into proper sql, will be important for gpt (requires thought - existing solution?)
    * don't want to overwrite user preferences on writing?
* convert anonymous login to google login
* close / open all accordions (low)
* if user has already written something, incorporate into generation? maybe not?

**other**
* tests?