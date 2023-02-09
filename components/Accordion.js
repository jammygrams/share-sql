import React from "react";
import Grid from "@mui/material/Grid";
import { styled } from "@mui/material/styles";
// import Accordion from "@mui/material/Accordion";
// import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import MuiAccordionSummary from "@mui/material/AccordionSummary";
import MuiAccordion from "@mui/material/Accordion";
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AddIcon from "@mui/icons-material/Add";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import dynamic from "next/dynamic";
import { Typography } from "@mui/material";
import { queryGPT } from "@/lib/openai";
import { UserContext } from "@/lib/context";

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

export function ChildAccordion({ index }) {
  const { user, documents, setDocuments, isLoading, setLoading } =
    React.useContext(UserContext);
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
    setExpanded(true); // always keep open on edit
    updateDocumentSummary(event.target.value);
  };

  const handleSummaryTextClick = (event) => {
    event.stopPropagation(); // Don't want to expand accordion
    setExpanded(true); // always keep open on click
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
          aria-controls="panel1d-content"
          id="panel1d-header"
          onClick={handleSummaryClick}
        >
          <Grid container spacing={1} alignItems="center">
            <Grid item xs={0.5} style={{ textAlign: "center" }}>
              <Typography variant="button">{`${index + 1}.`}</Typography>
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
