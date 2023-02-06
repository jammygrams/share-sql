import React, { useContext } from "react";
import { UserContext } from "@/lib/context";
import { newDoc } from '../components/ExampleDocs'
import { ChildAccordion, AddAccordionButton } from "../components/Accordion";

export default function Home() {
  const { user, documents, setDocuments } = useContext(UserContext)

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
