# Share SQL

## Todo
**features**
* Data persists in firestore
    * anonymous firestore login in index.js (done)
    * when login, create doc in users with user id (done)
    * for user, if no code data, create tutorial post (done)
    * load user posts and display them (done)
    * everytime we edit summary or code, update doc?
        * debounce?
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