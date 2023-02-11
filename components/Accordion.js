import React from "react";
import Grid from "@mui/material/Grid";
import { styled } from "@mui/material/styles";
import AccordionDetails from "@mui/material/AccordionDetails";
import MuiAccordionSummary from "@mui/material/AccordionSummary";
import MuiAccordion from "@mui/material/Accordion";
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import dynamic from "next/dynamic";
import debounce from "lodash.debounce";
import { Typography } from "@mui/material";
import { queryGPT } from "@/lib/openai";
import { UserContext } from "@/lib/context";
import { deleteDocumentFirestore, saveDocumentFirestore } from "@/lib/firebase";

// Need to import CodeEditor with no server side rendering
// ref: https://github.com/securingsincity/react-ace/issues/1044
const CodeEditor = dynamic(() => import("./CodeEditor"), { ssr: false });

// These have to be at top level, including them in ChildAccordion
//   means they are recreated everytime ChildAccordion rerenders, so no animation
const Accordion = styled((props) => <MuiAccordion disableGutters {...props} />)(
  ({ theme }) => ({
    "&:not(:last-child)": {
      borderBottom: 0,
    },
    "&:before": {
      display: "none",
    },
  })
);

const AccordionSummary = styled((props) => (
  <MuiAccordionSummary
    expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: "0.9rem" }} />}
    {...props}
  />
))(({ theme }) => ({
  flexDirection: "row-reverse",
  "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
    transform: "rotate(90deg)",
  },
  "& .MuiAccordionSummary-content": {
    marginLeft: theme.spacing(1),
  },
}));

export function ChildAccordion({ index, isExpanded }) {
  const { user, documents, setDocuments, isLoading, setLoading } =
    React.useContext(UserContext);

  const [expanded, setExpanded] = React.useState(isExpanded);

  function updateDocument(newDoc) {
    const newDocuments = [...documents];
    newDocuments[index] = newDoc;
    setDocuments(newDocuments);
  }

  const handleSummaryClick = (event) => {
    // need this and expanded state so first accordion can stay open
    event.stopPropagation(); // Don't want to expand accordion
    setExpanded(!expanded);
  };

  const handleSummaryTextEdit = (event) => {
    event.stopPropagation(); // Don't want to expand accordion
    setExpanded(true); // always keep open on edit
    const newDoc = {
      ...documents[index],
      data: { ...documents[index].data, summary: event.target.value },
    };
    updateDocument(newDoc);
    return newDoc;
  };

  // useCallback makes sure function isn't recreated everytime ChildAccordion is rerendered (every keystroke)
  const debounceSave = React.useCallback(
    debounce(saveDocumentFirestore, 500),
    [] // no state variables are affected by this function
  );

  const debouncedHandleSummaryEdit = (event) => {
    const newDoc = handleSummaryTextEdit(event);
    debounceSave({ uid: user.uid, document: newDoc });
  };

  const handleSummaryTextClick = (event) => {
    event.stopPropagation(); // Don't want to expand accordion
    setExpanded(true); // always keep open on click
  };

  const handleGenerateSummary = async () => {
    setLoading(true);
    const newSummary = await queryGPT(documents[index].data.content);
    const newDoc = await {
      ...documents[index],
      data: { ...documents[index].data, summary: newSummary },
    };
    updateDocument(newDoc);
    await saveDocumentFirestore({
      uid: user.uid,
      document: newDoc,
    });
    setLoading(false);
  };

  const handleContentEdit = (value) => {
    const newDoc = {
      ...documents[index],
      data: { ...documents[index].data, content: value },
    };
    updateDocument(newDoc);
    return newDoc;
  };

  const debouncedHandleContentEdit = (value) => {
    const newDoc = handleContentEdit(value);
    debounceSave({ uid: user.uid, document: newDoc });
  };

  const handleDeleteClick = () => {
    // this works bc: doesn't wait for async delete command, and filter is independent
    if (documents[index].id) {
      deleteDocumentFirestore({ uid: user.uid, docId: documents[index].id });
    }
    const newDocuments = documents.filter((doc, idx) => idx != index);
    setDocuments(newDocuments);
  };

  return (
    <div>
      <Accordion expanded={expanded}>
        <AccordionSummary
          aria-controls="panel1d-content"
          id="panel1d-header"
          onClick={handleSummaryClick}
        >
          <Grid container spacing={1} alignItems="center">
            <Grid item xs={0.5} style={{ textAlign: "center" }}>
              <Typography variant="button">{`${index + 1}.`}</Typography>
            </Grid>
            <Grid item xs={11.0}>
              <TextField
                fullWidth
                onClick={handleSummaryTextClick}
                onChange={debouncedHandleSummaryEdit}
                id="standard-basic"
                value={documents[index].data.summary}
                label="Summary"
                variant="standard"
              />
            </Grid>
            <Grid item xs={0.5} align="center">
              <IconButton
                edge="start"
                color="inherit"
                aria-label="delete"
                onClick={handleDeleteClick}
                sx={{ mr: 2 }}
              >
                <DeleteIcon />
              </IconButton>
            </Grid>
          </Grid>
        </AccordionSummary>
        <AccordionDetails>
          <CodeEditor
            onCodeChange={debouncedHandleContentEdit}
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
