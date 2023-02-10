import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import SaveIcon from "@mui/icons-material/Save";
import IconButton from "@mui/material/IconButton";
import { Typography } from "@mui/material";
import { saveDocumentsFirestore } from "../lib/firebase";
import Loader from "./Loader";
import { useContext } from "react";
import { UserContext } from "@/lib/context";

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export default function ButtonAppBar() {
  const { user, documents, setDocuments, isLoading, setLoading } =
    useContext(UserContext);

  async function handleSave() {
    setLoading(true);
    await saveDocumentsFirestore({
      uid: user.uid,
      documents,
    });
    await delay(400); // otherwise too fast to see the loader
    setLoading(false);
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Share SQL
          </Typography>
          {user && documents ? (
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="save"
              // important for onClick to be {() => functionName()}, otherwise function just calls!
              onClick={handleSave}
              sx={{ mr: 2 }}
            >
              <SaveIcon />
            </IconButton>
          ) : null}
          <Loader show={isLoading} />
        </Toolbar>
      </AppBar>
    </Box>
  );
}
