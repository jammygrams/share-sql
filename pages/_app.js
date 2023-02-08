import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import ButtonAppBar from "@/components/Appbar";
import { UserContext } from "../lib/context";
import { createUserAndDoc, db, auth } from "../lib/firebase";
import { tutorialDoc } from "../components/ExampleDocs";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import React, { useEffect } from "react";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

export default function App({ Component, pageProps }) {
  const [user, setUser] = React.useState(null); // user is not nec as state as not used
  const [documents, setDocuments] = React.useState([]);
  const [isLoading, setLoading] = React.useState(false);

  // TODO: move this to firebase.js so all that code is together?
  useEffect(() => {
    createUserAndDoc(tutorialDoc);
    onAuthStateChanged(auth, (authUser) => {
      if (authUser) {
        setUser(authUser);
        getDocs(
          query(
            collection(db, "users", authUser.uid, "code"),
            orderBy("createdAt")
          )
        ).then((querySnapshot) => {
          setDocuments(
            querySnapshot.docs.map((doc) => ({
              id: doc.id,
              data: doc.data(),
            }))
          );
        });
      } else {
        setUser(null);
      }
    });
  }, []);

  return (
    <>
      <UserContext.Provider value={{ user, documents, setDocuments, isLoading, setLoading }}>
        <ThemeProvider theme={darkTheme}>
          <CssBaseline />
          <ButtonAppBar />
          <Component
            {...pageProps}
            // documents={documents}
            // user={user}
            // setDocuments={setDocuments}
          />
        </ThemeProvider>
      </UserContext.Provider>
    </>
  );
}
