import { useState } from "react";
import { Box, Typography, Button } from "@mui/material";
import { AlertProps } from "@mui/material/Alert";
import { Report } from "./reportComponent";
import { Monitoring } from "./monitComponent";
import SnackbarAlert from "../../../components/SnackbarAlert";
import { useAppDispatch } from "../../../redux/AppStore";
import { getJobs } from "../../../redux/jobs/getJobs";

const HomePage = () => {
  const dispatch = useAppDispatch();
  const [snackbar, setSnackbar] = useState<Pick<
    AlertProps,
    "children" | "severity"
  > | null>(null);

  const handleGetActualData = () => {
    dispatch(getJobs());
    setSnackbar({
      children: "Pobieram aktualne dane - operacja może potrwać kilka minut",
      severity: "success",
    });
  };

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
            color: "#38373D",
            marginLeft: 1,
          }}
        >
          Centrum dowodzenia
        </Typography>
        <Button
          onClick={handleGetActualData}
          sx={{ position: "absolute", top: 15, right: 20, zIndex: 1 }}
        >
          pobierz aktualne dane
        </Button>
      </Box>
      <Monitoring />
      <Report />
      <SnackbarAlert alert={snackbar} />
    </Box>
  );
};

export default HomePage;
