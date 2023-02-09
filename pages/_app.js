import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import ButtonAppBar from "@/components/Appbar";
import { UserContext } from "../lib/context";
import { setUpUserAndDocs } from "../lib/firebase";
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

  useEffect(() => {
    setUpUserAndDocs({ documents, setDocuments, setUser });
  }, []);

  return (
    <>
      <UserContext.Provider
        value={{ user, documents, setDocuments, isLoading, setLoading }}
      >
        <ThemeProvider theme={darkTheme}>
          <CssBaseline />
          <ButtonAppBar />
          <Component
            {...pageProps}
          />
        </ThemeProvider>
      </UserContext.Provider>
    </>
  );
}
