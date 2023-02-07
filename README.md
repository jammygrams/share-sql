# Share SQL

## Todo
**features**
* Data persists in firestore
    * anonymous firestore login in index.js (done)
    * when login, create doc in users with user id (done)
    * for user, if no code data, create tutorial post (done)
    * load user posts and display them (done)
    * move state up to _app.js (which runs on top of index), and turn into context so easier to access everywhere (done)
    * all accordions need to write document state by index. (done)
    * save button. 
    * change save to debounce on typing?
* Come up with design v2 - tough, ask kaiden
    * just have preview of sql viewable in each box at start? all slightly open?
* teams
* multiplayer

**lower priority**
* remove accordion button and update doc
* close / open all accordions
* display tables used in query in summary
* format user input sql into proper sql, will be important for gpt
* loading symbol while waiting for response generate?
* convert anonymous login to google login
* if user has already written something, incorporate into generation? maybe not?

**other**
* tests?