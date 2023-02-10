import React, { useContext } from "react";
import { UserContext } from "@/lib/context";
import { newDoc } from "../components/ExampleDocs";
import { addDoc } from "firebase/firestore";
import { ChildAccordion, AddAccordionButton } from "../components/Accordion";

export default function Home() {
  const { user, documents, setDocuments, isLoading, setLoading } =
    useContext(UserContext);

  async function handleAddAccordion() {
    docRef = await addDoc(collection(db, "users", uid, "code"), newDoc.data)
    console.log("Document added: ", docRef.id);
    const toAddDoc = { ...newDoc, id: docRef.id };
    setDocuments([...documents, toAddDoc]);
  }

  return (
    <>
      {documents.map((doc, idx) => {
        return <ChildAccordion index={idx} key={idx} />;
      })}
      <AddAccordionButton onClick={handleAddAccordion} />
    </>
  );
}
