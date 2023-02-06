# Share SQL

## Todo
**features**
* Data persists in firestore
    * anonymous firestore login in index.js (done)
    * when login, create doc in users with user id (done)
    * for user, if no code data, create tutorial post (done)
    * load user posts and display them (done)
    * move state up to _app.js (which runs on top of index), and turn into context so easier to access everywhere (done)
    * save button!? also save on generate summary? and open close accordion (maybe too much)?
    * change save to debounce on typing?
* Come up with design v2 - tough, ask kaiden
* teams
* multiplayer

**lower priority**
* remove accordion button and update doc
* display tables used in query in summary
* format user input sql into proper sql, will be important for gpt
* loading symbol while waiting for response generate?
* convert anonymous login to google login
* if user has already written something, incorporate into generation? maybe not?

**other**
* tests?