import React from "react";
import Grid from "@mui/material/Grid";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AddIcon from '@mui/icons-material/Add';
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import dynamic from "next/dynamic";
import { Typography } from "@mui/material";

// Need to import CodeEditor with no server side rendering
// ref: https://github.com/securingsincity/react-ace/issues/1044
const CodeEditor = dynamic(() => import("./CodeEditor"), { ssr: false });

export function ChildAccordion({
  id,
  initialCode = "",
  initialSummary = "",
  isExpanded = false,
}) {
  const [codeData, setCodeData] = React.useState(initialCode);
  const [summary, setSummary] = React.useState(initialSummary);
  const [expanded, setExpanded] = React.useState(isExpanded);

  async function queryGPT(SQLCode) {
    try {
      const response = await fetch("/api/openai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ sql: SQLCode }),
      });
      const data = await response.json();
      if (response.status !== 200) {
        throw (
          data.error ||
          new Error(`Request failed with status ${response.status}`)
        );
      }
      console.log(`Prediction: ${data.result}`);
      return data.result;
    } catch (error) {
      // Consider implementing your own error handling logic here
      console.error(error);
      alert(error.message);
    }
  }

  const handleSummaryClick = () => {
    setExpanded(!expanded);
  };

  const handleSummaryTextEdit = (event) => {
    event.stopPropagation(); // Don't want to expand accordion
    setSummary(event.target.value);
  };

  const handleSummaryTextClick = (event) => {
    event.stopPropagation(); // Don't want to expand accordion
  };

  const handleGenerateSummary = () => {
    queryGPT(codeData).then((value) => setSummary(value)); // for async
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
              <Typography>{id}</Typography>
            </Grid>
            <Grid item xs={11.5}>
              <TextField
                fullWidth
                onClick={handleSummaryTextClick}
                onChange={handleSummaryTextEdit}
                id="standard-basic"
                value={summary}
                label="Summary"
                variant="standard"
              />
            </Grid>
          </Grid>
        </AccordionSummary>
        <AccordionDetails>
          <CodeEditor onCodeChange={setCodeData} initialValue={codeData} />
          <Button variant="text" onClick={handleGenerateSummary}>
            Generate Summary
          </Button>
        </AccordionDetails>
      </Accordion>
    </div>
  );
}

export function Accordions() {
  function AddAccordionButton({ onClick }) {
    return (
      <Button variant="text" onClick={onClick}>
        <AddIcon />
      </Button>
    );
  }

  const [lines, setLines] = React.useState([0]);

  function handleAddAccordion() {
    setLines([...lines, lines.length]);
  }

  return (
    <>
      {lines.map((m) => (
        <ChildAccordion key={m} id={m + 2} />
      ))}
      <AddAccordionButton onClick={handleAddAccordion} />
    </>
  );
}
