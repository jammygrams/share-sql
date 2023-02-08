import React from "react";
import Grid from "@mui/material/Grid";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AddIcon from "@mui/icons-material/Add";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import dynamic from "next/dynamic";
import { Typography } from "@mui/material";
import { queryGPT } from  "@/lib/openai"
import { UserContext } from "@/lib/context";

// Need to import CodeEditor with no server side rendering
// ref: https://github.com/securingsincity/react-ace/issues/1044
const CodeEditor = dynamic(() => import("./CodeEditor"), { ssr: false });

export function ChildAccordion({ index }) {
  const { user, documents, setDocuments, isLoading, setLoading } = React.useContext(UserContext);
  // make sure first accordion is expanded at start
  var isExpanded = null;
  index === 0 ? (isExpanded = true) : (isExpanded = false);

  const [expanded, setExpanded] = React.useState(isExpanded);

  function updateDocumentSummary(newSummary) {
    const newDocuments = documents.map((doc, idx) => {
      if (idx == index) {
        return {
          ...doc,
          data: {
            ...doc.data,
            summary: newSummary,
          },
        };
      } else {
        return doc;
      }
    });
    setDocuments(newDocuments);
  }

  const handleSummaryClick = () => {
    // need this and expanded state so first accordion can stay open
    setExpanded(!expanded);
  };

  const handleSummaryTextEdit = (event) => {
    event.stopPropagation(); // Don't want to expand accordion
    updateDocumentSummary(event.target.value);
  };

  const handleSummaryTextClick = (event) => {
    event.stopPropagation(); // Don't want to expand accordion
  };

  const handleGenerateSummary = async () => {
    setLoading(true);
    await queryGPT(documents[index].data.content).then((value) => {
      updateDocumentSummary(value);
    });
    setLoading(false);
  };

  const handleContentEdit = (value) => {
    const newDocuments = documents.map((doc, idx) => {
      if (idx == index) {
        const updatedDoc = {
          ...doc,
          data: {
            ...doc.data,
            content: value,
          },
        };
        return updatedDoc;
      } else {
        return doc;
      }
    });
    setDocuments(newDocuments);
  };

  return (
    <div>
      <Accordion expanded={expanded}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
          onClick={handleSummaryClick}
        >
          <Grid container spacing={1}>
            <Grid item xs={0.5}>
              <Typography>{index + 1}</Typography>
            </Grid>
            <Grid item xs={11.5}>
              <TextField
                fullWidth
                onClick={handleSummaryTextClick}
                onChange={handleSummaryTextEdit}
                id="standard-basic"
                value={documents[index].data.summary}
                label="Summary"
                variant="standard"
              />
            </Grid>
          </Grid>
        </AccordionSummary>
        <AccordionDetails>
          <CodeEditor
            onCodeChange={handleContentEdit}
            initialValue={documents[index].data.content}
          />
          <Button variant="text" onClick={handleGenerateSummary}>
            Generate Summary
          </Button>
        </AccordionDetails>
      </Accordion>
    </div>
  );
}

export function AddAccordionButton({ onClick }) {
  return (
    <Button variant="text" onClick={onClick}>
      <AddIcon />
    </Button>
  );
}
