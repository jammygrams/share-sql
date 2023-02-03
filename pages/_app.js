import { UserContext } from "@/lib/context";
import { useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";

export default function App({ Component, pageProps }) {
  // const auth = getAuth();
  // onAuthStateChanged(auth, (user) => {
  //   if (user) {
  //     // User is signed in, see docs for a list of available properties
  //     // https://firebase.google.com/docs/reference/js/firebase.User
  //     const uid = user.uid;
  //     // ...
  //   } else {
  //     // User is signed out
  //     // ...
  //     console.log("user signed out!")
  //   }
  // });
// value={{ uid }}

  return (
    <UserContext.Provider> 
      <Component {...pageProps} />
    </UserContext.Provider>
  )
}
