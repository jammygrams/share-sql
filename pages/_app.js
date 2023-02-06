import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import ButtonAppBar from "@/components/Appbar";
import { UserContext } from '../lib/context';
import { createUserAndDoc, db, auth } from "../lib/firebase";
import { tutorialDoc } from '../components/ExampleDocs'
import { collection, getDocs } from "firebase/firestore";
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

  useEffect(() => {
    createUserAndDoc(tutorialDoc);
    onAuthStateChanged(auth, (authUser) => {
      if (authUser) {
        setUser(authUser);
        getDocs(collection(db, "users", authUser.uid, "code")).then(
          (querySnapshot) => {
            setDocuments(querySnapshot.docs.map((doc) => doc.data()));
          }
        );
      } else {
        setUser(null);
      }
    });
  }, []);

  return (
    <>
    <UserContext.Provider value={{ user, documents, setDocuments }}>
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <ButtonAppBar />
        <Component {...pageProps} />
      </ThemeProvider>
    </UserContext.Provider>
    </>
  );
}
