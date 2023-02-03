import { UserContext } from "@/lib/context";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../lib/firebase"

export default function App({ Component, pageProps }) {
  var uid = null
  onAuthStateChanged(auth, (user) => {
    if (user) {
      uid = user.uid;
      console.log(`user is signed in as ${uid}!`);
    } else {
      console.log("user is signed out!");
    }
  });

  return (
    <UserContext.Provider value={{ uid }}> 
      <Component {...pageProps} />
    </UserContext.Provider>
  )
}
