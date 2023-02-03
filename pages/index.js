import { ChildAccordion, Accordions } from "../components/Accordion";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { signInAnonymously } from "firebase/auth";
import { auth, firestore } from '../lib/firebase'
import { collection, doc, setDoc } from "firebase/firestore"; 
import CssBaseline from '@mui/material/CssBaseline';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

const TutorialCode = "SELECT this, that FROM table1 WHERE that == '9'";
const TutorialSummary = "Return all this where that equals 9";

async function createUser() {
  const signInResult = await signInAnonymously(auth)
  const userUid = signInResult.user.uid; // The UID of the user.
  const userDoc = {
    username: ""
  }
  console.log("User ID: ", userUid);
  try {
    await setDoc(doc(firestore, "users", userUid), userDoc);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}

export default function Home() {
  createUser()

  return (
    <>
      <ThemeProvider theme={darkTheme}>
      <CssBaseline />
        <ChildAccordion
          id={1}
          initialCode={TutorialCode}
          initialSummary={TutorialSummary}
          isExpanded={true}
        />
        <Accordions />
      </ThemeProvider>
    </>
  );
}
