import { useState, useEffect } from "react";
import { UserContext } from "../lib/context";
import { anonSignIn, createNewUser, getUserData, isNewUser } from "../lib/firebase";
import "@/styles/globals.css";
import Loader from "../components/Loader";

export default function App({ Component, pageProps }) {
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState(null);

  useEffect(() => {
    async function initialize() {
      if (!user) {
        const authUser = await anonSignIn();
        const uid = authUser.uid;
        setUser(authUser);
        console.log(`User ${authUser.uid} logged in`)
        if (await isNewUser(uid)) {
          username = await createNewUser(uid);
          setUsername(username);
          console.log(`Created username ${username}`)
        } else {
          const userData = await getUserData(uid);
          setUsername(userData.username);
        }
      }
    }
    initialize();
  }, []);

  if (!user && !username) {
    return <Loader show />
  }

  return (
    <>
      <UserContext.Provider value={{ user, username }}>
        <Component {...pageProps} />
      </UserContext.Provider>
    </>
  );
}
