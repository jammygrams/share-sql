import { ChildAccordion, Accordions } from "../components/Accordion";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { signInAnonymously } from "firebase/auth";
import { auth, db } from "../lib/firebase";
import { serverTimestamp } from "firebase/firestore";
import { collection, doc, setDoc, addDoc } from "firebase/firestore";
import CssBaseline from "@mui/material/CssBaseline";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

const tutorialDoc = {
  content: "SELECT this, that FROM table1 WHERE that == '9'",
  summary: "Return all this where that equals 9",
  createdAt: serverTimestamp(),
  updatedAt: serverTimestamp(),
};

const TutorialCode = "SELECT this, that FROM table1 WHERE that == '9'";
const TutorialSummary = "Return all this where that equals 9";

function isNewUser(user) {
  const threshold = 500;
  return (
    Math.abs(user.metadata.lastSignInTime - user.metadata.creationTime) >
    threshold
  );
}

async function createUser() {
  const signInResult = await signInAnonymously(auth);
  const userUid = signInResult.user.uid; // The UID of the user.
  const userDoc = {};
  console.log("User ID: ", userUid);
  try {
    await setDoc(doc(db, "users", userUid), userDoc);
    if (isNewUser(signInResult.user)) {
      const docId = await addDoc(
        collection(db, "users", userUid, "code"),
        tutorialDoc
      );
      console.log("Added tutorial doc id: ", docId.id);
    }
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}

export default function Home() {
  createUser();

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
