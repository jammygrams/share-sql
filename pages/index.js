import { ChildAccordion, Accordions } from "../components/Accordion";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { createUser } from "../lib/firebase";
import { serverTimestamp } from "firebase/firestore";
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

export default function Home() {
  createUser(tutorialDoc);

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
