import React, { useEffect } from "react";
import { ChildAccordion, AddAccordionButton } from "../components/Accordion";
import { createUserAndDoc, db, auth } from "../lib/firebase";
import { collection, serverTimestamp, getDocs } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

const tutorialDoc = {
  content: "SELECT this, that FROM table1 WHERE that == '9'",
  summary: "Return all this where that equals 9",
  createdAt: serverTimestamp(),
  updatedAt: serverTimestamp(),
};

const newDoc = {
  code: "",
  summary: "",
  createdAt: serverTimestamp(),
  updatedAt: serverTimestamp(),
};

export default function Home() {
  const [uid, setUID] = React.useState(null); // uid is not nec as state as not used
  const [documents, setDocuments] = React.useState([]);

  useEffect(() => {
    createUserAndDoc(tutorialDoc);
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUID(user.uid);
        getDocs(collection(db, "users", user.uid, "code")).then(
          (querySnapshot) => {
            setDocuments(querySnapshot.docs.map((doc) => doc.data()));
          }
        );
      } else {
        setUID(none);
      }
    });
  }, []);

  const firstDocument = documents[0];
  const remainingDocuments = documents.slice(1);

  function handleAddAccordion() {
    setDocuments([...documents, newDoc]);
  }

  return (
    <>
        {firstDocument ? (
          <ChildAccordion
            id={1}
            initialCode={firstDocument.content}
            initialSummary={firstDocument.summary}
            isExpanded={true}
          />
        ) : null}
        {remainingDocuments.map((doc, index) => (
          <ChildAccordion
            initialCode={doc.content}
            initialSummary={doc.summary}
            key={index}
            id={index + 2}
          />
        ))}
        <AddAccordionButton onClick={handleAddAccordion} />
    </>
  );
}
