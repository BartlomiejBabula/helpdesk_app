import { Box, Typography } from "@mui/material";
import { Report } from "./reportComponent";
import { Monitoring } from "./monitComponent";

const HomePage = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        padding: 2,
      }}
    >
      <Box sx={{ marginBottom: 2 }}>
        <Typography
          variant='h6'
          sx={{
            letterSpacing: 2,
            color: "text.primary",
            marginLeft: 1,
          }}
        >
          Centrum dowodzenia
        </Typography>
      </Box>
      <Monitoring />
      <Report />
    </Box>
  );
};

export default HomePage;
