import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";

export default function Loader({ show }) {
  return show ? (
    <Box sx={{ display: "flex" }}>
      <CircularProgress />
    </Box>
  ) : null;
}
