import React, { useContext } from "react";
import { UserContext } from "@/lib/context";
import { newDoc } from "../components/ExampleDocs";
import { ChildAccordion, AddAccordionButton } from "../components/Accordion";

export default function Home() {
  const { user, documents, setDocuments, isLoading, setLoading } =
    useContext(UserContext);

  function handleAddAccordion() {
    setDocuments([...documents, newDoc]);
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
