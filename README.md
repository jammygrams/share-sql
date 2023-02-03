# Share SQL

## Todo
**features**
* Data persists in firestore
    * anonymous firestore login in index.js (done)
    * when login, create doc in users with user id (done)
    * we pass user info to context in _app.js, so we can query user documents (done)
        * TODO: will this actually work for new user?
    * for user, if no code data, create tutorial post (done)
    * load user posts and display them
    * everytime we edit summary or code, update doc?
        * debounce?
* Come up with design v2 - tough, ask kaiden
* teams
* multiplayer

**lower priority**
* convert anonymous login to google login
* display tables used in query in summary
* format user input sql into proper sql, will be important for gpt
* if user has already written something, incorporate into generation? maybe not?
* loading symbol while waiting for response?

