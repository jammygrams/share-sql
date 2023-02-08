// import MenuIcon from '@mui/icons-material/Menu';
// import Typography from '@mui/material/Typography';
import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import SaveIcon from "@mui/icons-material/Save";
import IconButton from "@mui/material/IconButton";
import { saveDocumentsFirestore } from "../lib/firebase";
import { useContext } from "react";
import { UserContext } from "@/lib/context";

export default function ButtonAppBar() {
  const { user, documents, setDocuments } = useContext(UserContext);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          {user && documents ? (
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="save"
              // important for onClick to be () => ..., otherwise function just calls!
              onClick={() => {
                saveDocumentsFirestore({
                  uid: user.uid,
                  documents,
                  setDocuments,
                });
              }}
              sx={{ mr: 2 }}
            >
              <SaveIcon />
            </IconButton>
          ) : null}
          {/* <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            News
          </Typography> */}
          {/* <Button color="inherit">Login</Button> */}
        </Toolbar>
      </AppBar>
    </Box>
  );
}
